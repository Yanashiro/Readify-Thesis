const mongoose = require('mongoose');
const { passageCollection } = require('./config');

async function seed() {
    // testType: 1-11 maps to the 11 question types
    const testTypes = [
        { type: 1,  name: 'Multiple Choices' },
        { type: 2,  name: 'Matching Features' },
        { type: 3,  name: 'Matching Information' },
        { type: 4,  name: 'Identifying Information' },
        { type: 5,  name: 'Identifying Writers Views' },
        { type: 6,  name: 'Matching Sentence Endings' },
        { type: 7,  name: 'Matching Headings' },
        { type: 8,  name: 'Summary Completion' },
        { type: 9,  name: 'Short Answer Questions' },
        { type: 10, name: 'Sentence Completion' },
        { type: 11, name: 'Diagram Label Completion' },
    ];

    for (const testType of testTypes) {
        const existing = await passageCollection.findOne({ testType: testType.type });
        if (existing) {
            console.log(`testType ${testType.type} (${testType.name}) already exists, skipping`);
            continue;
        }

        const questions = [];
        for (let i = 1; i <= 10; i++) {
            questions.push({
                questionNumber: i,
                questionText: `Question: Placeholder ${i} for ${testType.name}`,
                data: [
                    `Option A: Placeholder ${i}`,
                    `Option B: Placeholder ${i}`,
                    `Option C: Placeholder ${i}`,
                    `Option D: Placeholder ${i}`,
                ],
                correctAnswer: `Option A: Placeholder ${i}`,
            });
        }

        const passage = new passageCollection({
            testId: testType.type,
            testDesignation: true,
            testType: testType.type,
            passageTitle: `Passage Title: Placeholder for ${testType.name}`,
            passage: `Passage Body: Placeholder text for ${testType.name}. Replace this with an actual reading passage.`,
            questions: questions,
        });

        await passage.save();
        console.log(`Seeded testType ${testType.type} (${testType.name})`);
    }

    console.log('Seeding complete');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});