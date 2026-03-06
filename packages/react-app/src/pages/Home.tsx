import "web-greeting";
import "web-counter";

export function Home() {
  return (
    <main>
      <web-greeting name="郝聰明" />
      <web-counter init-value={87} />
    </main>
  );
}
