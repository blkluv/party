import ReactDOM from "react-dom";

export default function Portal({ children }: any) {
    return ReactDOM.createPortal(children, document.getElementById("app"));
}
