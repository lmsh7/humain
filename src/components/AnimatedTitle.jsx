import React, { useEffect, useRef } from 'react';

const AnimatedTitle = ({
    title = '特朗普为什么急着俄乌停火?',
    fontSize = 48, // Default font size in pixels
    strokeColor = '#000000',
    outlineColor = '#d4e3fc'
}) => {
    const writerRefs = useRef([]);
    const containerRefs = useRef([]);
    const characterSize = Math.floor(fontSize * 1.2);

    useEffect(() => {
        let isActive = true;

        const initializeWriter = async (char, index) => {
            if (!containerRefs.current[index] || typeof HanziWriter === 'undefined') return null;

            const writer = HanziWriter.create(containerRefs.current[index], char, {
                width: characterSize,
                height: characterSize,
                padding: Math.floor(characterSize * -0.1), // Scale padding with size
                strokeAnimationSpeed: 10,
                delayBetweenStrokes: 0,
                strokeColor: strokeColor,
                outlineColor: outlineColor,
                showOutline: false,
                showCharacter: false,
                renderer: 'svg'
            });

            writerRefs.current[index] = writer;
            return writer;
        };

        const animateCharacters = async () => {
            const writers = await Promise.all(
                title.split('').map((char, i) => initializeWriter(char, i))
            );

            if (!isActive) return;

            for (let i = 0; i < writers.length; i++) {
                const writer = writers[i];
                if (!writer) continue;

                await new Promise(resolve => {
                    writer.animateCharacter({
                        onComplete: () => {
                            writer.showCharacter();
                            resolve();
                        }
                    });
                });
            }
        };

        const timer = setTimeout(animateCharacters, 100);

        return () => {
            isActive = false;
            clearTimeout(timer);
            writerRefs.current.forEach(writer => {
                writer?.cancelQuiz();
                writer?.pauseAnimation();
            });
            writerRefs.current = [];
        };
    }, [title, fontSize, strokeColor, outlineColor, characterSize]);

    return (
        <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2" style={{ fontSize: `${fontSize}px` }}>
                {title.split('').map((char, i) => (
                    <div
                        key={i}
                        ref={el => containerRefs.current[i] = el}
                        className="inline-block"
                        style={{
                            width: `${characterSize}px`,
                            height: `${characterSize}px`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnimatedTitle;