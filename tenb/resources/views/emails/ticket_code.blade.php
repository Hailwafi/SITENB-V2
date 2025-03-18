<!DOCTYPE html>
<html>
<head>
    <title>Kode Tiket Anda</title>
</head>
<body>
    <h1>Halo, {{ $ticket->nama_lengkap }}</h1>
    <p>Terima kasih telah membuat tiket. Berikut adalah detail tiket Anda:</p>
    <ul>
        <li>Kode Tiket: <strong>{{ $ticket->kode_tiket }}</strong></li>
        <li>Token Tiket: <strong>{{ $ticket->token_tiket }}</strong></li>
        <li>Kategori: {{ $ticket->kategori }}</li>
        <li>Sub Kategori: {{ $ticket->sub_kategori }}</li>
        <li>Jenis Tiket: {{ $ticket->jenis_tiket }}</li>
        <li>Deskripsi: {{ $ticket->deskripsi }}</li>
    </ul>
    <p>Silakan gunakan kode tiket ini untuk memeriksa status tiket Anda di platform kami.</p>
</body>
</html>
