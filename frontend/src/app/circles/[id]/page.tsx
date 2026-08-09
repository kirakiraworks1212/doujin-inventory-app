import Link from 'next/link';

type Circle = {
  id: number;
  name: string;
  spaceNumber: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  currentStock: number;
  imageUrl: string | null;
  inStock: boolean;
};

async function getCircle(id: string): Promise<Circle | null> {
  const res = await fetch('http://localhost:3001/public/circles', {
    cache: 'no-store',
  });
  const circles: Circle[] = await res.json();
  return circles.find((c) => c.id === Number(id)) ?? null;
}

async function getProducts(circleId: string): Promise<Product[]> {
  const res = await fetch(
    `http://localhost:3001/public/products?circleId=${circleId}`,
    { cache: 'no-store' },
  );
  return res.json();
}

export default async function CircleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const circle = await getCircle(id);
  const products = await getProducts(id);

  if (!circle) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">サークルが見つかりませんでした。</p>
        <Link href="/" className="text-blue-500 underline">
          一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm text-blue-500 underline mb-4 inline-block">
        ← サークル一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mb-1">{circle.name}</h1>
      <p className="text-gray-500 mb-6">スペース: {circle.spaceNumber}</p>

      <h2 className="text-lg font-semibold mb-3">頒布物</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">まだ商品が登録されていません。</p>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                {product.description && (
                  <p className="text-sm text-gray-500">{product.description}</p>
                )}
                <p className="text-sm mt-1">¥{product.price}</p>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  product.inStock
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.inStock ? `在庫あり (${product.currentStock})` : '在庫切れ'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}