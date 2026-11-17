"""Offline audio regression: joining must preserve speech timing and fade before silence."""
import array
import math
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import wave

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import song_ngu
import vivibe_tts as tts


class VoiceMixTest(unittest.TestCase):
    def test_join_keeps_duration_marks_silence_and_soft_edges(self):
        ffmpeg = tts.find_ffmpeg()
        rate = 44100
        duration = 0.5
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            parts = []
            for index, (lang, text) in enumerate((('vi', 'Nghe câu mẫu:'), ('en', 'She is happy.'))):
                wav = root / f'{index}.wav'
                # Nonzero onset/end: catches abrupt edges which zero-phase fixtures hide.
                samples = array.array('h', (int(6000 * math.cos(2 * math.pi * (440 + index * 220) * n / rate))
                                           for n in range(int(rate * duration))))
                with wave.open(str(wav), 'wb') as stream:
                    stream.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
                    stream.writeframes(samples.tobytes())
                parts.append({'lang': lang, 'text': text, 'wav': wav, 'voice_name': lang})
            output = root / 'mixed.mp3'
            marks = tts.mix_line(ffmpeg, parts, output)
            gap = song_ngu.gap_after(parts[0]['text'])
            self.assertAlmostEqual(marks[0]['end'], duration, places=3)
            self.assertAlmostEqual(marks[1]['start'], duration + gap, places=3)
            self.assertAlmostEqual(marks[1]['end'], 2 * duration + gap, places=3)
            pcm = root / 'decoded.wav'
            subprocess.run([ffmpeg, '-v', 'error', '-i', str(output), '-ar', str(rate), '-ac', '1',
                            '-c:a', 'pcm_s16le', str(pcm)], capture_output=True, check=True)
            decoded = array.array('h')
            with wave.open(str(pcm), 'rb') as stream:
                decoded.frombytes(stream.readframes(stream.getnframes()))
            self.assertAlmostEqual(len(decoded) / rate, 2 * duration + gap, delta=0.003)

            def rms(start, end):
                values = decoded[round(start * rate):round(end * rate)]
                return math.sqrt(sum(v * v for v in values) / len(values))

            middle = rms(0.15, 0.25)
            self.assertLess(rms(0, 0.004), middle * 0.4)
            self.assertLess(rms(duration - 0.004, duration), middle * 0.4)
            self.assertLess(rms(duration + 0.03, duration + gap - 0.03), 5)
            second = duration + gap
            self.assertLess(rms(second, second + 0.004), rms(second + 0.15, second + 0.25) * 0.4)
            self.assertGreater(rms(second + 0.15, second + 0.25), 1000)
            self.assertLess(max(abs(v) for v in decoded), 32767)


if __name__ == '__main__':
    unittest.main()
