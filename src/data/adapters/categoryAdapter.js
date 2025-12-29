export const categoryAdapter = (data) => {
    if (!data) return null;

    return {
        id: data._id,
        title: data.title || "",
        description: data.description || "",
        icon: data.icon || "",

        // Xử lý logic Layout (Populated object hoặc ID string)
        layoutId: typeof data.gridLayoutId === 'object' ? data.gridLayoutId?._id : data.gridLayoutId || "",
        layoutTitle: typeof data.gridLayoutId === 'object' ? data.gridLayoutId?.title : "—",
    };
};