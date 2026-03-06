import r2wc from "@r2wc/react-to-web-component";
import { Counter } from "./Counter";

customElements.define("web-counter", r2wc(Counter, { props: { initValue: "number" } }));
