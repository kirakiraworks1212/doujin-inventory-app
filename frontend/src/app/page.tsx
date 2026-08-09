import Link from 'next/link';

type Circle = {
  id: number;
  name: string;
  spaceNumber: string;
};

async function getCircles(): Promise<Circle[]> {
  const res = await fetch('http://localhost:3001/public/circles', {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Home() {
  const circles = await getCircles();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">サークル一覧</h1>

      {circles.length === 0 ? (
        <p className="text-gray-500">まだサークルが登録されていません。</p>
      ) : (
        <ul className="space-y-3">
          {circles.map((circle) => (
            <li key={circle.id}>
              <Link
                href={`/circles/${circle.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{circle.name}</span>
                  <span className="text-sm text-gray-500">
                    スペース: {circle.spaceNumber}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}