# SurveyIO

Projenin amacı kullanıcıların kolay bir şekilde istedikleri konu hakkında diğer kişilerin ne düşündüğünü herkese açık şekilde görebilmektir.
<p align="center">
<img src="https://raw.githubusercontent.com/meryemisik/survey-io/main/client/src/image/readme-logo.png" style="width: clamp(100px, 100%, 480px) !important " />
</p>

# Önemli Not

Normal şartlarda projeye telefon numaranız ile login olup SMS ile OTP girişi yapabiliyorsunuz. Fakat projede Google Firebase Authentication ücretsiz limitleri sebebi ile günlük 10 doğrulama kadarına izin veriliyor. Eğer giriş yaptığınızda bir sorun ile karşılaşırsanız "Telefon Numarası" alanına "1111111111" şeklinde giriş yapabilirsiniz :)

# Başlarken

Proje 3 ana dizinden oluşmaktadır. Bunlar server (Firebase, Socket.IO), client/frontend (VueJS) ve mobile app (React Native) teknolojileri kullanılarak geliştirilmektedir.


# Kurulum

Projeyi kendi localinizde çalıştırabilmek için öncelikle bulunduğu dizine girine ve 3 farklı terminal oluşturun.

- Server dizininde; 

    `$ npm i && npm start`

- Client dizininde;

    `$ npm i && npm run serve`

- Mobile dizininde;

    `$ npm i && npm run ios`

# Yapılanlar & Yapılacaklar

- [x] Yeni anket oluşturma
- [x] Kişisel renklendirme ve istenilen seçenekleri ekleme
- [ ] Verilen kod ile gizli anketlere ulaşma
- [x] Telefon numarası ile kayıt/giriş yapma
- [ ] Telefon numarasına göre kullanıcıların oluşturduğu anketleri görme
- [ ] Anketi paylaşma butonu

# Demo Linkleri

- [Web APP](https://survey-io.vercel.app/)
- [Mobile APP](#)
