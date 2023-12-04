export function MainButton({buttonSize, Image, imageColor, imageSize, onClick, onMouseOver, onMouseOut}) {
    return (
        <button className={buttonSize === "small" ? "main-button-small flex-c" : "main-button flex-c"} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <Image color={imageColor} size={imageSize}></Image>
        </button>
    )
}