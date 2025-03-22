export const handleCopy = (event, colorHex, setCopyStatus) => {
    event.preventDefault(); // Link 이동 방지
    event.stopPropagation(); // 이벤트 버블링 차단

    navigator.clipboard
        .writeText(colorHex)
        .then(() => {
            setCopyStatus(colorHex);
            setTimeout(() => setCopyStatus(null), 1000);
        })
        .catch(() => setCopyStatus(null));
};
