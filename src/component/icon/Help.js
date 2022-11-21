import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Help(props) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M12 3c-4.969 0-9 4.031-9 9s4.031 9 9 9 9-4.031 9-9-4.031-9-9-9zm-.281 14.25a.938.938 0 110-1.875.938.938 0 010 1.875zm1.567-4.781c-.76.51-.864.977-.864 1.406a.656.656 0 01-1.313 0c0-1.027.473-1.844 1.445-2.497.904-.606 1.415-.99 1.415-1.836 0-.574-.328-1.01-1.008-1.334-.16-.076-.515-.15-.953-.145-.55.007-.976.139-1.305.403-.62.499-.672 1.042-.672 1.05a.656.656 0 11-1.312-.064c.005-.114.084-1.14 1.16-2.006.56-.449 1.27-.682 2.11-.693.595-.007 1.155.094 1.534.273 1.135.537 1.758 1.432 1.758 2.516 0 1.586-1.06 2.298-1.995 2.927z"
                fill="#4CD080"
            />
        </Svg>
    )
}

export default Help