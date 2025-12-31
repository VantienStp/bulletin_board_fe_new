// src/data/adapters/categoryAdapter.js

export const categoryAdapter = (data) => {
    if (!data) return null;

    return {
        id: data._id,
        title: data.title || "",
        description: data.description || "",
        icon: data.icon || "",

        layoutId: typeof data.gridLayoutId === 'object' ? data.gridLayoutId?._id : data.gridLayoutId || "",
        layoutTitle: data.layoutTitle || (typeof data.gridLayoutId === 'object' ? data.gridLayoutId?.title : "—"),
        cardCount: data.cardCount !== undefined ? data.cardCount : (data.mappings?.length || 0),
    };
};