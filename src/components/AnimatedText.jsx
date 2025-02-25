import React, { useEffect, useRef, useState } from 'react';

const AnimatedText = ({
    text = '特朗普为什么急着俄乌停火?',
    className = 'text-3xl font-bold', // 默认使用Tailwind类
    strokeColor = '#000000',
    outlineColor = '#d4e3fc'
}) => {
    const writerRefs = useRef([]);
    const containerRefs = useRef([]);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    
    // 过滤非汉字字符，只保留中文字符
    const filteredText = text.replace(/[^\u4e00-\u9fff]/g, '');

    // 从Tailwind类中提取字体大小
    const getFontSize = () => {
        const sizeMap = {
            'text-xs': 12, 'text-sm': 14, 'text-base': 16, 'text-lg': 18, 'text-xl': 20,
            'text-2xl': 24, 'text-3xl': 30, 'text-4xl': 36, 'text-5xl': 48,
            'text-6xl': 60, 'text-7xl': 72, 'text-8xl': 96, 'text-9xl': 128
        };

        for (const [cls, size] of Object.entries(sizeMap)) {
            if (className.includes(cls)) {
                return size;
            }
        }
        return 30; // 默认为text-3xl大小
    };

    const fontSize = getFontSize();
    const characterSize = Math.floor(fontSize * 1.2);

    useEffect(() => {
        let isActive = true;

        const initializeWriter = async (char, index) => {
            if (!containerRefs.current[index] || typeof HanziWriter === 'undefined') return null;

            const writer = HanziWriter.create(containerRefs.current[index], char, {
                width: characterSize,
                height: characterSize,
                padding: Math.floor(characterSize * -0.1),
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
                filteredText.split('').map((char, i) => initializeWriter(char, i))
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

            setIsAnimationComplete(true);
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
    }, [filteredText, characterSize, strokeColor, outlineColor, className]);

    // 显示动画容器
    return (
        <div className={`flex flex-wrap ${className}`}>
            {filteredText.split('').map((char, i) => (
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
    );
};

export default AnimatedText;