import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import './Home.css';

interface Crypto {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price_usd: string;
}

const Home: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.coinlore.net/api/tickers/');
      const json = await response.json();
      setCryptoData(json.data);
    } catch (err) {
      setError('Gagal memuat data. Periksa koneksi internet Anda.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>🪙 Daftar Cryptocurrency</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Tombol Refresh */}
        <div className="refresh-wrapper">
          <IonButton
            expand="block"
            color="primary"
            onClick={fetchCryptoData}
            disabled={loading}
            className="refresh-btn"
          >
            <IonIcon slot="start" icon={refreshOutline} />
            Refresh
          </IonButton>
        </div>

        {/* Loading */}
        {loading && (
          <div className="centered">
            <IonSpinner name="crescent" color="primary" />
            <p className="loading-text">Memuat data...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="centered">
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Daftar Cryptocurrency */}
        {!loading && !error && (
          <div className="crypto-list">
            {cryptoData.map((item) => (
              <div key={item.id} className="crypto-card">
                {/* Kolom Kiri: Rank */}
                <div className="col-rank">
                  <span className="col-label">Rank</span>
                  <span className="rank-value">{item.rank}</span>
                </div>

                {/* Kolom Tengah: Nama & Simbol */}
                <div className="col-middle">
                  <span className="coin-name">{item.name}</span>
                  <span className="coin-symbol">{item.symbol}</span>
                </div>

                {/* Kolom Kanan: Harga USD */}
                <div className="col-right">
                  <span className="col-label">USD</span>
                  <span className="price-value">
                    {parseFloat(item.price_usd).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
