import React from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  position: absolute;
  opacity: 0;
  top: -9999px;
  left: 0;
`;

function triggerCopy(textarea) {
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const isCopied = document.execCommand("copy");
  if (!isCopied) {
    throw new Error("You must used toClipboard in inside an event triggered by the user");
  }
}

export default function WithCopy(Component) {
  const WrappedComponent = ({ onClick, children, copyValue = children, forwardedRef, ...rest }) => {
    const textareaRef = React.useRef(null);
    const handleClick = e => {
      triggerCopy(textareaRef.current);
      if (onClick) onClick(e);
    };

    if (typeof copyValue !== "string") {
      throw new Error("You need specify copyValue or children should be a string");
    }

    return (
      <React.Fragment>
        <Textarea value={copyValue} readOnly={true} ref={textareaRef} />
        <Component {...rest} title={copyValue} ref={forwardedRef} onClick={handleClick}>
          {children}
        </Component>
      </React.Fragment>
    );
  };

  WrappedComponent.displayName = `WithCopy(${Component.displayName})`;

  return React.forwardRef((props, ref) => <WrappedComponent {...props} forwardedRef={ref} />);
}
