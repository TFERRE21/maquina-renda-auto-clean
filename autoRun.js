==> Running 'node autoRun.js'
🚀 Iniciando automação completa...
🧠 Gerando roteiro mínimo 2 minutos...
✅ Roteiro salvo!
🖼 Gerando 6 imagens...
✅ Imagem 1 criada
✅ Imagem 2 criada
✅ Imagem 3 criada
✅ Imagem 4 criada
✅ Imagem 5 criada
✅ Imagem 6 criada
🎉 Imagens geradas!
🎙 Gerando áudio...
✅ Áudio criado!
🎬 Criando vídeo final...
ffmpeg version 5.1.8-0+deb12u1 Copyright (c) 2000-2025 the FFmpeg developers
  built with gcc 12 (Debian 12.2.0-14+deb12u1)
  configuration: --prefix=/usr --extra-version=0+deb12u1 --toolchain=hardened --libdir=/usr/lib/x86_64-linux-gnu --incdir=/usr/include/x86_64-linux-gnu --arch=amd64 --enable-gpl --disable-stripping --enable-gnutls --enable-ladspa --enable-libaom --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libcdio --enable-libcodec2 --enable-libdav1d --enable-libflite --enable-libfontconfig --enable-libfreetype --enable-libfribidi --enable-libglslang --enable-libgme --enable-libgsm --enable-libjack --enable-libmp3lame --enable-libmysofa --enable-libopenjpeg --enable-libopenmpt --enable-libopus --enable-libpulse --enable-librabbitmq --enable-librist --enable-librubberband --enable-libshine --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libssh --enable-libsvtav1 --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx265 --enable-libxml2 --enable-libxvid --enable-libzimg --enable-libzmq --enable-libzvbi --enable-lv2 --enable-omx --enable-openal --enable-opencl --enable-opengl --enable-sdl2 --disable-sndio --enable-libjxl --enable-pocketsphinx --enable-librsvg --enable-libmfx --enable-libdc1394 --enable-libdrm --enable-libiec61883 --enable-chromaprint --enable-frei0r --enable-libx264 --enable-libplacebo --enable-librav1e --enable-shared
  libavutil      57. 28.100 / 57. 28.100
  libavcodec     59. 37.100 / 59. 37.100
  libavformat    59. 27.100 / 59. 27.100
  libavdevice    59.  7.100 / 59.  7.100
  libavfilter     8. 44.100 /  8. 44.100
  libswscale      6.  7.100 /  6.  7.100
  libswresample   4.  7.100 /  4.  7.100
  libpostproc    56.  6.100 / 56.  6.100
Input #0, concat, from '/opt/render/project/src/output/list.txt':
  Duration: N/A, start: 0.000000, bitrate: N/A
  Stream #0:0: Video: png, rgb24(pc), 720x1280 [SAR 1:1 DAR 9:16], 25 fps, 25 tbr, 25 tbn
Input #1, mp3, from '/opt/render/project/src/output/audio.mp3':
  Metadata:
    encoder         : Lavf59.27.100
  Duration: 00:02:00.05, start: 0.046042, bitrate: 8 kb/s
  Stream #1:0: Audio: mp3, 24000 Hz, mono, fltp, 8 kb/s
Stream mapping:
  Stream #0:0 -> #0:0 (png (native) -> h264 (libx264))
  Stream #1:0 -> #0:1 (mp3 (mp3float) -> aac (native))
Press [q] to stop, [?] for help
[libx264 @ 0x6264a797a440] using SAR=1/1
[libx264 @ 0x6264a797a440] using cpu capabilities: MMX2 SSE2Fast SSSE3 SSE4.2 AVX FMA3 BMI2 AVX2
[libx264 @ 0x6264a797a440] profile Constrained Baseline, level 3.1, 4:2:0, 8-bit
[libx264 @ 0x6264a797a440] 264 - core 164 r3095 baee400 - H.264/MPEG-4 AVC codec - Copyleft 2003-2022 - http://www.videolan.org/x264.html - options: cabac=0 ref=1 deblock=0:0:0 analyse=0:0 me=dia subme=0 psy=1 psy_rd=1.00:0.00 mixed_ref=0 me_range=16 chroma_me=1 trellis=0 8x8dct=0 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=0 threads=24 lookahead_threads=4 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=0 weightp=0 keyint=250 keyint_min=25 scenecut=0 intra_refresh=0 rc=crf mbtree=0 crf=28.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=0
Output #0, mp4, to '/opt/render/project/src/output/video_final.mp4':
  Metadata:
    encoder         : Lavf59.27.100
  Stream #0:0: Video: h264 (avc1 / 0x31637661), yuv420p(tv, progressive), 720x1280 [SAR 1:1 DAR 9:16], q=2-31, 25 fps, 12800 tbn
    Metadata:
      encoder         : Lavc59.37.100 libx264
    Side data:
      cpb: bitrate max/min/avg: 0/0/0 buffer size: 0 vbv_delay: N/A
  Stream #0:1: Audio: aac (LC) (mp4a / 0x6134706D), 24000 Hz, mono, fltp, 128 kb/s
    Metadata:
      encoder         : Lavc59.37.100 aac
frame=    1 fps=0.0 q=0.0 size=       0kB time=00:00:00.00 bitrate=N/A speed=   0x    
frame=  501 fps=126 q=17.0 size=       0kB time=00:00:19.00 bitrate=   0.0kbits/s dup=499 drop=0 speed=4.79x    
frame= 1001 fps=138 q=17.0 size=       0kB time=00:00:39.00 bitrate=   0.0kbits/s dup=998 drop=0 speed=5.36x    
More than 1000 frames duplicated
