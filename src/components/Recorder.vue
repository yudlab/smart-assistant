<template>
    <canvas ref="canvas" class="canvas"></canvas>
</template>
  
<script>
import dat from 'dat.gui';

export default {
    data() {
        return {
            WIDTH: 800,
            HEIGHT: 400,
            ctx: null,
            opts: {
                smoothing: 0.9,
                fft: 9,
                minDecibels: -70,
                scale: 0.9,
                glow: 50,
                color1: [203, 36, 128],
                color2: [41, 200, 192],
                color3: [24, 137, 218],
                fillOpacity: 0.8,
                lineWidth: 1,
                blend: "screen",
                shift: 50,
                width: 60,
                amp: 1.1,
            },
            gui: null,
            context: null,
            analyser: null,
            freqs: null,
        };
    },
    mounted() {
        this.ctx = this.$refs.canvas.getContext("2d");
        this.gui = new dat.GUI();
        this.gui.close();

        // Connect GUI to opts (add your GUI settings here)
        this.gui.addColor(this.opts, "color1");
        this.gui.addColor(this.opts, "color2");
        this.gui.addColor(this.opts, "color3");
        // ... add more GUI controls here ...

        this.start();
    },
    methods: {
        start() {
            // Check for getUserMedia support
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.mediaDevices.getUserMedia ||
                navigator.msGetUserMedia;

            if (typeof navigator.getUserMedia === "function") {
                navigator.getUserMedia({ audio: true }, this.onStream, this.onStreamError);
            } else {
                console.error("getUserMedia not supported in this browser.");
            }
        },
        onStream(stream) {
            console.log("onStream");
            this.context = new AudioContext();
            this.analyser = this.context.createAnalyser();
            this.freqs = new Uint8Array(this.analyser.frequencyBinCount);

            const input = this.context.createMediaStreamSource(stream);
            input.connect(this.analyser);
            requestAnimationFrame(this.visualize);
        },
        onStreamError(e) {
            console.error("Error accessing the microphone.", e);
        },
        visualize() {
            this.analyser.smoothingTimeConstant = this.opts.smoothing;
            this.analyser.fftSize = Math.pow(2, this.opts.fft);
            this.analyser.minDecibels = this.opts.minDecibels;
            this.analyser.maxDecibels = 0;
            this.analyser.getByteFrequencyData(this.freqs);

            this.$refs.canvas.width = this.WIDTH;
            this.$refs.canvas.height = this.HEIGHT;

            // Draw three curves (R/G/B)
            this.path(0);
            this.path(1);
            this.path(2);

            // Schedule next paint
            requestAnimationFrame(this.visualize);
        },
        path(channel) {
            // Read color1, color2, color3 from the opts
            const color = this.opts[`color${channel + 1}`].map(Math.floor);

            // Turn the [r,g,b] array into an rgba() CSS color
            this.ctx.fillStyle = `rgba(${color}, ${this.opts.fillOpacity})`;

            // Set stroke and shadow the same solid rgb() color
            this.ctx.strokeStyle = this.ctx.shadowColor = `rgb(${color})`;

            this.ctx.lineWidth = this.opts.lineWidth;
            this.ctx.shadowBlur = this.opts.glow;
            this.ctx.globalCompositeOperation = this.opts.blend;

            const m = this.HEIGHT / 2; // the vertical middle of the canvas

            // For the curve with 5 peaks, we need 15 control points

            // Calculate how much space is left around it
            const offset = (this.WIDTH - 15 * this.opts.width) / 2;

            // Calculate the 15 x-offsets
            const x = Array.from({ length: 15 }, (_, i) => offset + channel * this.opts.shift + i * this.opts.width);

            // Pick some frequencies to calculate the y values
            // Scale based on position so that the center is always bigger
            const y = Array.from({ length: 5 }, (_, i) => Math.max(0, m - this.scale(i) * this.freq(channel, i)));

            const h = 2 * m;

            this.ctx.beginPath();
            this.ctx.moveTo(0, m); // Start in the middle of the left side
            this.ctx.lineTo(x[0], m + 1); // Straight line to the start of the first peak

            this.ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]); // Curve to 1st value
            this.ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]); // 2nd value
            this.ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]); // 3rd value
            this.ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]); // 4th value
            this.ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]); // 5th value

            this.ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m); // Curve back down to the middle

            this.ctx.lineTo(this.WIDTH, m + 1); // Straight line to the right edge
            this.ctx.lineTo(x[13], m - 1); // And back to the end of the last peak

            // Now the same in reverse for the lower half of our shape

            this.ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
            this.ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
            this.ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
            this.ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
            this.ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
            this.ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);

            this.ctx.lineTo(0, m); // Close the path by going back to the start

            this.ctx.fill();
            this.ctx.stroke();
        },
        freq(channel, i) {
            // Calculate the band for the given channel and value index
            const shuffle = [1, 3, 0, 4, 2];
            const band = 2 * channel + shuffle[i] * 6;
            return this.freqs[band];
        },
        scale(i) {
            const x = Math.abs(2 - i); // 2, 1, 0, 1, 2
            const s = 3 - x; // 1, 2, 3, 2, 1
            return (s / 3) * this.opts.amp;
        },
    },
};
</script>
