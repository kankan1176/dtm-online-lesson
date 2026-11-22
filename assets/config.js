// 公開情報。未確認の税区分・受信先は確定後に設定。
window.SITE_CONFIG = {
  "schoolName": "KミュージックDTMスクール",
  "prices": {
    "vocal-recording": 5000,
    "vocal-editing": 10000,
    "vocal-mixing": 7000,
    "daw-production": 7000,
    "instrument-editing": 12000,
    "mixing-mastering": 15000
  },
  "bundles": [
    {
      "id": "vocal-pack",
      "name": "歌ってみたパック",
      "price": 16000,
      "courseIds": [
        "vocal-recording",
        "vocal-editing",
        "vocal-mixing"
      ]
    },
    {
      "id": "engineer-pack",
      "name": "サウンドエンジニアパック",
      "price": 30000,
      "courseIds": [
        "daw-production",
        "instrument-editing",
        "mixing-mastering"
      ]
    }
  ],
  "taxLabel": "税区分は確認中",
  "paymentMethods": [
    "PayPay",
    "カード決済"
  ],
  "paymentNote": "お支払い手順・支払期限・キャンセル条件は、受付開始前にご案内します。現在このサイトで決済は行いません。",
  "formEndpoint": "",
  "contactEmail": "",
  "operatorName": "",
  "archivePeriod": "",
  "cancellationPolicy": ""
};

