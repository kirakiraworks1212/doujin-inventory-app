'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ページを開いた瞬間に、トークンがあるか確認する
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // トークンがなければ、ログインしていないのでログイン画面に戻す
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    router.push('/login');
  }

  if (checking) {
    return <p className="p-6">確認中...</p>;
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
      <p className="text-gray-500">
        ログインに成功しました。ここに今後、商品登録・在庫編集・売上記録の機能を追加していきます。
      </p>
    </main>
  );
}