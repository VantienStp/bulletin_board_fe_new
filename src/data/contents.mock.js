// src/data/contents.mock.js

export const contents = [
    {
        id: "content-1",
        cardId: "card-1",

        type: "image",
        url: "/mock/news-1.jpg",
        description: "AI và pháp luật – góc nhìn tổng quan",

        displayRule: {
            totalDays: 20,              // tổng ngày được hiển thị
            mode: "business",           // business | weekend | all
            startedAt: "2025-03-01",    // ngày bắt đầu tính
            usedDays: 8,                // mock: đã hiển thị 8 ngày
        },

        status: "active",             // active | expired | paused
    },

    {
        id: "content-2",
        cardId: "card-1",

        type: "image",
        url: "/mock/news-2.jpg",
        description: "Ứng dụng AI trong ngành tư pháp",

        displayRule: {
            totalDays: 20,
            mode: "business",
            startedAt: "2025-03-05",
            usedDays: 3,
        },

        status: "active",
    },

    {
        id: "content-3",
        cardId: "card-1",

        type: "pdf",
        url: "/mock/report-ai-law.pdf",
        description: "Báo cáo chi tiết AI & Pháp luật",

        displayRule: {
            totalDays: 10,
            mode: "weekend",
            startedAt: "2025-03-10",
            usedDays: 2,
        },

        status: "active",
    },
];
