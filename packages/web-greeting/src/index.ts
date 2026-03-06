import r2wc from "@r2wc/react-to-web-component";
import { Greeting } from "./Greeting";

customElements.define("web-greeting", r2wc(Greeting, { props: { name: "string" } }));
