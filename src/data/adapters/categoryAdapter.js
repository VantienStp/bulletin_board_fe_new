export const categoryAdapter = (data) => {
    if (!data) return null;

    return {
        id: data._id || data.id,
        title: data.title || "",
        description: data.description || "",
        icon: data.icon || "",
        order: data.order ?? 0,

        layoutId: typeof data.gridLayoutId === 'object' ? data.gridLayoutId?._id : data.gridLayoutId || "",
        layoutTitle: data.layoutTitle || (typeof data.gridLayoutId === 'object' ? data.gridLayoutId?.title : "—"),

        layoutConfig: typeof data.gridLayoutId === 'object' ? data.gridLayoutId?.config : null,

        cardCount: data.cardCount !== undefined ? data.cardCount : (data.mappings?.length || 0),
        mappings: data.mappings || []
    };
};