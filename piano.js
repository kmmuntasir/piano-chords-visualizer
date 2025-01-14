// Cached note sequences
const WHITE_NOTES_SEQUENCE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES_SEQUENCE = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']; // '' for missing black keys

class Piano {
    constructor(pianoStyle = {}, width = 800, height = 300, totalWhiteReeds = 7, startingNote = 'C') {
        this.pianoStyle = {
            whiteKeyColor: 'white',
            blackKeyColor: 'black',
            whiteKeyStrokeColor: 'black',
            blackKeyStrokeColor: 'black',
            whiteKeyFontColor: 'black',
            blackKeyFontColor: 'white',
            fontSizeFactor: 12,
            ...pianoStyle, // Override default styles with custom styles
        };
        this.width = width;
        this.height = height;
        this.totalWhiteReeds = totalWhiteReeds;

        this.startingIndex = WHITE_NOTES_SEQUENCE.indexOf(startingNote);
        if (this.startingIndex === -1) {
            throw new Error('Invalid starting note! Please provide a valid white key note (C, D, E, F, G, A, B).');
        }

        this.whiteKeyWidth = width / totalWhiteReeds;
        this.blackKeyWidth = this.whiteKeyWidth * 0.66;
        this.whiteKeyHeight = height;
        this.blackKeyHeight = height * 0.6;
        this.ctxLineWidth = this.whiteKeyWidth / 40;
    }

    drawWhiteKeys(ctx) {
        let currentWhiteNoteIndex = this.startingIndex;

        for (let i = 0; i < this.totalWhiteReeds; i++) {
            const whiteNote = WHITE_NOTES_SEQUENCE[currentWhiteNoteIndex % 7];
            ctx.fillStyle = this.pianoStyle.whiteKeyColor;
            ctx.fillRect(i * this.whiteKeyWidth, 0, this.whiteKeyWidth, this.whiteKeyHeight);
            ctx.lineWidth = this.ctxLineWidth;
            ctx.strokeStyle = this.pianoStyle.whiteKeyStrokeColor;
            ctx.strokeRect(i * this.whiteKeyWidth, 0, this.whiteKeyWidth, this.whiteKeyHeight);

            this.drawNoteLabel(ctx, whiteNote, i * this.whiteKeyWidth + this.whiteKeyWidth / 2, this.whiteKeyHeight - (this.height / 7.5), this.pianoStyle.whiteKeyFontColor);

            currentWhiteNoteIndex++;
        }
    }

    drawBlackKeys(ctx) {
        let currentWhiteNoteIndex = this.startingIndex;

        for (let i = 0; i < this.totalWhiteReeds; i++) {
            const whiteNoteIndex = currentWhiteNoteIndex % 7;
            const blackNote = BLACK_NOTES_SEQUENCE[whiteNoteIndex];

            if (blackNote !== '') {
                const left = i * this.whiteKeyWidth + this.whiteKeyWidth - this.blackKeyWidth / 2;
                ctx.fillStyle = this.pianoStyle.blackKeyColor;
                ctx.fillRect(left, 0, this.blackKeyWidth, this.blackKeyHeight);
                ctx.lineWidth = this.ctxLineWidth;
                ctx.strokeStyle = this.pianoStyle.blackKeyStrokeColor;
                ctx.strokeRect(left, 0, this.blackKeyWidth, this.blackKeyHeight);

                this.drawNoteLabel(ctx, blackNote, left + this.blackKeyWidth / 2, this.blackKeyHeight - (this.height / 9), this.pianoStyle.blackKeyFontColor);
            }

            currentWhiteNoteIndex++;
        }
    }

    drawNoteLabel(ctx, text, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = `bold ${Math.floor(this.height / this.pianoStyle.fontSizeFactor)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'piano-wrapper';
        wrapper.style.width = `${this.width}px`;
        wrapper.style.height = `${this.height}px`;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.drawWhiteKeys(ctx);
        this.drawBlackKeys(ctx);

        return wrapper;
    }
}

// Function to batch-render pianos
function renderPianos(pianoConfigs, containerId) {
    const fragment = document.createDocumentFragment();
    pianoConfigs.forEach(config => {
        const piano = new Piano(...config);
        fragment.appendChild(piano.render());
    });
    document.getElementById(containerId).appendChild(fragment);
}
