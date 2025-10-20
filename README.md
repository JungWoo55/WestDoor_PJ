## Get started
### 도커 실행
cd infra
docker-compose up -d

### 백엔드 환경 설정
cd BE

.env 파일 만들기
npm install
npm install cors

### DB 실행
cd prisma
-- npx prisma migrate reset -- 서버 충돌날 경우
npx prisma migrate dev --name init

### 백엔드 실행
cd ..
npm run dev


### 프론트 환경설정
cd FE

expo-env.d.ts 파일 만들기
npm install
npm install axios

### 프론트 실행
npm start

