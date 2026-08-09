'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
  currentStock: number;
  initialStock: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [circleId, setCircleId] = useState<number | null>(null);

  // 商品登録フォームの入力値
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function fetchProducts(token: string, cId: number) {
    const productsRes = await fetch(
      `http://localhost:3001/products?circleId=${cId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const productsData = await productsRes.json();
    setProducts(productsData);
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const meRes = await fetch('http://localhost:3001/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) {
          localStorage.removeItem('accessToken');
          router.push('/login');
          return;
        }
        const me = await meRes.json();
        setCircleId(me.circleId);
        await fetchProducts(token, me.circleId);
      } catch {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    router.push('/login');
  }

  // 商品登録フォームの送信処理
  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!circleId) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          circleId,
          name,
          price: Number(price),
          initialStock: Number(initialStock),
        }),
      });

      if (!res.ok) {
        throw new Error('商品の登録に失敗しました');
      }

      // 登録成功したら、入力欄をリセットして、一覧を再取得する
      setName('');
      setPrice('');
      setInitialStock('');
      await fetchProducts(token, circleId);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : '商品の登録に失敗しました',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="p-6">読み込み中...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">スタッフ管理画面</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 underline"
        >
          ログアウト
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 商品登録フォーム */}
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">新しい商品を登録</h2>
        <form onSubmit={handleCreateProduct} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">商品名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">価格</label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                初期在庫
              </label>
              <input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold mb-3">商品一覧</h2>

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
                <p className="text-sm text-gray-500">¥{product.price}</p>
              </div>
              <span className="text-sm">
                在庫: {product.currentStock} / {product.initialStock}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}