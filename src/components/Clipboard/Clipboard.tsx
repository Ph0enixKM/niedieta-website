import type { ComponentPropsWithoutRef } from "react";
import Clip from "./Clip";
import styles from "./Clipboard.module.css";

interface Props extends ComponentPropsWithoutRef<"div"> {
    /** Extra classes for the sheet of paper under the clip. */
    sheetClassName?: string;
}

/**
 * An espresso-stained oak clipboard whose steel lever clip holds a sheet of paper; the children are written on the
 * sheet. Size and tilt it with --clipboard-w and --clipboard-tilt.
 */
export default function Clipboard({ className, sheetClassName, children, ...rest }: Props) {
    return (
        <div className={[styles.board, className].filter(Boolean).join(" ")} {...rest}>
            <Clip className={styles.clip} />
            <div className={[styles.sheet, sheetClassName].filter(Boolean).join(" ")}>{children}</div>
        </div>
    );
}
