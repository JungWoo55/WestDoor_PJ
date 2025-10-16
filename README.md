## Get started
### 도커 실행
cd infra
docker-compose up -d

### 백엔드 환경 설정
cd BE
npm install

### DB 실행
cd prisma
npx prisma migrate dev --name init

### 백엔드 실행
npm run dev

### 프론트 환경설정 및 실행
cd FE
npm install
npm start

