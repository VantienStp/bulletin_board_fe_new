'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function CardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/cards/${id}`)
      .then((res) => res.json())
      .then((data) => setCard(data))
      .catch(console.error);
  }, [id]);

  if (!card) return <p>Đang tải...</p>;

  return (
    <div className="admin-detail">
      <button className="btn-back" onClick={() => router.push('/admin/cards')}>
        ← Quay lại danh sách
      </button>
      <h2>{card.title}</h2>
      <hr />

      <div className="contents-grid">
        {card.contents.map((c, i) => (
          <div key={i} className="content-box">
            {c.type === 'image' && <img src={c.url} alt="" className="preview-img" />}
            <p>{c.description}</p>
            {c.qrCode && <img src={c.qrCode} alt="QR" className="qr-img" />}
          </div>
        ))}
      </div>
    </div>
  );
}
