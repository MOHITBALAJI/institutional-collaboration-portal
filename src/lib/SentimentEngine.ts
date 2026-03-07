/**
 * Strategic Sentiment AI Engine
 * Logic for analyzing textual engagement and scoring sentiment
 * for the "Campus Pulse" tactical dashboard.
 */

export interface SentimentScore {
    score: number; // -1 to 1
    magnitude: number; // 0 to 1
    label: 'positive' | 'neutral' | 'negative';
    keywords: string[];
}

const POSITIVE_WORDS = [
    'great', 'excellent', 'amazing', 'brilliant', 'success', 'improved',
    'growth', 'love', 'happy', 'productive', 'efficient', 'helpful',
    'collaborative', 'innovation', 'breakthrough', 'smooth', 'future'
];

const NEGATIVE_WORDS = [
    'bad', 'poor', 'slow', 'fail', 'difficult', 'struggle', 'issue',
    'bug', 'error', 'frustrating', 'hard', 'stuck', 'delay', 'broken',
    'stress', 'pressure', 'hard', 'tired', 'disappointed'
];

export const analyzeSentiment = (text: string): SentimentScore => {
    const input = text.toLowerCase();
    const words = input.split(/\W+/);

    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    const foundKeywords: string[] = [];

    words.forEach(word => {
        if (POSITIVE_WORDS.includes(word)) {
            positiveCount++;
            foundKeywords.push(word);
        } else if (NEGATIVE_WORDS.includes(word)) {
            negativeCount++;
            foundKeywords.push(word);
        }
    });

    const totalWords = words.length;
    if (totalWords === 0) return { score: 0, magnitude: 0, label: 'neutral', keywords: [] };

    // Calculate score
    score = (positiveCount - negativeCount) / (Math.max(positiveCount + negativeCount, 1));
    const magnitude = (positiveCount + negativeCount) / totalWords;

    let label: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';

    return {
        score,
        magnitude: Math.min(magnitude * 5, 1), // Boost magnitude for visualization
        label,
        keywords: Array.from(new Set(foundKeywords)).slice(0, 5)
    };
};

export const getMockPulseData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(h => ({
        hour: h,
        sentiment: Math.random() * 2 - 1, // -1 to 1
        volume: Math.floor(Math.random() * 100),
    }));
};
