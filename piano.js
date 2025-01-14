// Cached note sequences
const WHITE_NOTES_SEQUENCE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES_SEQUENCE = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']; // '' for missing black keys

class Piano {
    constructor(pianoStyle = {}, width = 800, height = 300, totalWhiteReeds = 7, startingNote = 'C', chordNotes = []) {
        this.pianoStyle = {
            whiteKeyColor: 'white',
            blackKeyColor: 'black',
            whiteKeyStrokeColor: 'black',
            blackKeyStrokeColor: 'black',
            whiteKeyFontColor: 'black',
            blackKeyFontColor: 'white',
            highlightColor: 'limegreen', // Default highlight color
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
        this.chordNotes = chordNotes; // Notes to highlight

        this.generatePianoKeys()
    }

    generatePianoKeys() {
        let whiteKeys = [];
        let blackKeys = [];
        let totalKeys = []; // Array to hold both white and black keys sequentially

        for (let i = 0; i < this.totalWhiteReeds; i++) {
            // Get the current white-key note based on the starting index
            const currentWhiteNote = WHITE_NOTES_SEQUENCE[(this.startingIndex + i) % 7];
            whiteKeys.push(currentWhiteNote);

            // Get the corresponding black key (if any)
            const currentBlackNote = BLACK_NOTES_SEQUENCE[(this.startingIndex + i) % 7];
            blackKeys.push(currentBlackNote);
        }

        // Generate the totalKeys array by alternating white and black keys
        let whiteKeyIndex = 0;
        let blackKeyIndex = 0;
        for (let i = 0; i < this.totalWhiteReeds; i++) {
            // Push the white key first
            totalKeys.push(whiteKeys[whiteKeyIndex]);
            whiteKeyIndex++;

            // If there's a black key corresponding to the current white key, add it next
            totalKeys.push(blackKeys[blackKeyIndex]);
            blackKeyIndex++;
        }

        // Now we have the totalKeys array with both white and black keys sequentially
        this.pianoKeys = {
            whiteKeys: whiteKeys,
            blackKeys: blackKeys,
            totalKeys: totalKeys // Add the totalKeys array to the pianoKeys object
        };

        console.log(this.pianoKeys);
    }


    // Function to highlight only the sequential chord notes (in order)
    highlightSequentialNotes(notes, keySequence) {
        let highlightedIndexes = [];
        // let chordNoteIndex = 0;
        //
        // // Track when a note should be highlighted
        // for (let i = 0; i < keySequence.length; i++) {
        //     // If the current note matches the next note in the chord sequence
        //     if (chordNoteIndex < notes.length && keySequence[i] === notes[chordNoteIndex]) {
        //         highlightedIndexes.push(i);
        //         chordNoteIndex++;
        //     }
        // }

        return highlightedIndexes;
    }

    drawKeys(ctx) {
        // Get the sequential indexes of chord notes to highlight
        const highlightedIndexes = this.highlightSequentialNotes(this.chordNotes, this.pianoKeys.totalKeys);

        for (let totalKeyIndex = 0, whiteKeyIndex = 0, blackKeyIndex = 0; totalKeyIndex < this.pianoKeys.totalKeys.length; totalKeyIndex++) {
            const key = this.pianoKeys.totalKeys[totalKeyIndex];
            const isHighlighted = highlightedIndexes.includes(totalKeyIndex);

            if (!key.includes('#') && key !== '') {
                // Draw white key
                const leftPosition = whiteKeyIndex * this.whiteKeyWidth;
                ctx.fillStyle = isHighlighted ? this.pianoStyle.highlightColor : this.pianoStyle.whiteKeyColor;
                ctx.fillRect(leftPosition, 0, this.whiteKeyWidth, this.whiteKeyHeight);
                ctx.lineWidth = this.ctxLineWidth;
                ctx.strokeStyle = this.pianoStyle.whiteKeyStrokeColor;
                ctx.strokeRect(leftPosition, 0, this.whiteKeyWidth, this.whiteKeyHeight);

                // Draw white note label
                this.drawNoteLabel(ctx, key, whiteKeyIndex * this.whiteKeyWidth + this.whiteKeyWidth / 2, this.whiteKeyHeight - (this.height / 7.5), this.pianoStyle.whiteKeyFontColor);
                ++whiteKeyIndex;
            } else if (key !== '') {
                // Draw black key
                const leftPosition = (blackKeyIndex - Math.floor(blackKeyIndex / 2)) * this.whiteKeyWidth + this.whiteKeyWidth - this.blackKeyWidth / 2; // Adjust position of black key
                ctx.fillStyle = isHighlighted ? this.pianoStyle.highlightColor : this.pianoStyle.blackKeyColor;
                ctx.fillRect(leftPosition, 0, this.blackKeyWidth, this.blackKeyHeight);
                // ctx.lineWidth = this.ctxLineWidth;
                // ctx.strokeStyle = this.pianoStyle.blackKeyStrokeColor;
                // ctx.strokeRect(left, 0, this.blackKeyWidth, this.blackKeyHeight);

                // Draw black note label
                this.drawNoteLabel(ctx, key, leftPosition + this.blackKeyWidth / 2, this.blackKeyHeight - (this.height / 9), this.pianoStyle.blackKeyFontColor);
                ++blackKeyIndex;
            }
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

        this.drawKeys(ctx);

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
