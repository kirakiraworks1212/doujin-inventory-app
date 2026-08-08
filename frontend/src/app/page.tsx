async function getCircles() {
  const res = await fetch('http://localhost:3001/public/circles', {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Home() {
  const circles = await getCircles();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>サークル一覧(接続テスト)</h1>
      <ul>
        {circles.map((circle: { id: number; name: string; spaceNumber: string }) => (
          <li key={circle.id}>
            {circle.name}(スペース: {circle.spaceNumber})
          </li>
        ))}
      </ul>
    </div>
  );
}