SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Eqsn8uGA0YrdOLzbimTSyf75ypcui4UMz8mfMqV2dha5TKPpxPcaz5jXa0iRr81

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: staff_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "slug", "name", "description", "status", "price_amount", "price_currency", "compare_at_amount", "label", "created_at", "updated_at") VALUES
	('6da834f1-bb5a-497a-8da0-cd8956d87a1e', 'neck-roll', 'Neck Roll', NULL, 'published', 7000.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.212703+00', '2026-11-26 13:21:10.212703+00'),
	('25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'capp-169-qf-rp', 'BED IN A BAG', 'Cotton quilt and bed sheet set.', 'published', 44500.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.215712+00', '2026-11-26 13:21:10.215712+00'),
	('01ccdd34-04f4-411e-825c-8fbd5c02e3c3', 'quran-cover', 'Quran Cover', NULL, 'published', 2750.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.217949+00', '2026-11-26 13:21:10.217949+00'),
	('988058e6-35a6-4712-b196-de7a8163df02', 'table-linen', 'Table Linen', NULL, 'published', 9000.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.219936+00', '2026-11-26 13:21:10.219936+00'),
	('f04da3e3-68d8-4e33-b2b0-22f07fd079bb', 'tw-445b', 'TOWEL SET (04-PCS)', NULL, 'published', 10900.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.22236+00', '2026-11-26 13:21:10.22236+00'),
	('d7db06e3-41dc-46d6-a274-3cac867609c2', 'silk-plain-bed-sheet-set', 'Silk Plain Bed Sheet Set', 'Silk plain sheet set includes 1 bed sheet and 2 pillow cases.', 'published', 12900.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.224625+00', '2026-11-26 13:21:10.224625+00'),
	('15293447-0299-44dc-9a82-89dfe80c2c5c', 'khaise', 'Khaise', '100% cotton, printed Khaise bedspread.', 'published', 14500.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.226485+00', '2026-11-26 13:21:10.226485+00'),
	('31d3e3cd-5fbf-4e41-83bc-67a32f0aaa5d', 'sale-bedding-set', 'Printed Bedding Set', NULL, 'published', 8990.00, 'PKR', 9990.00, '-10%', '2026-11-26 13:21:10.228826+00', '2026-11-26 13:21:10.228826+00'),
	('721474ef-7a33-4cc0-a787-bc0caf786599', 'sale-coverlet', 'Coverlet', NULL, 'published', 7490.00, 'PKR', 8490.00, '-10%', '2026-11-26 13:21:10.230667+00', '2026-11-26 13:21:10.230667+00'),
	('acba90d4-9ce6-454d-b97b-b72f62de2023', '99-names-of-allah-calligraphy', '99 Names of Allah Calligraphy', '99 Names of Allah Calligraphy, selected for the wall art and home decor collection.', 'published', 3999.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.232636+00', '2026-11-26 13:21:10.232636+00'),
	('fdda8b02-71fd-46c0-8033-46beb2dd6712', 'bismillah-islamic-wall-plaque', 'Bismillah Islamic Wall Plaque', 'Bismillah Islamic Wall Plaque, selected for the wall art and home decor collection.', 'published', 2490.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.235954+00', '2026-11-26 13:21:10.235954+00'),
	('a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 'alhamdulillah-calligraphy-panel', 'Alhamdulillah Calligraphy Panel', 'Alhamdulillah Calligraphy Panel, selected for the wall art and home decor collection.', 'published', 2890.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.239199+00', '2026-11-26 13:21:10.239199+00'),
	('bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 'ayatul-kursi-wooden-wall-art', 'Ayatul Kursi Wooden Wall Art', 'Ayatul Kursi Wooden Wall Art, selected for the wall art and home decor collection.', 'published', 3490.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.242342+00', '2026-11-26 13:21:10.242342+00'),
	('bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 'allah-muhammad-twin-calligraphy-set', 'Allah Muhammad Twin Calligraphy Set', 'Allah Muhammad Twin Calligraphy Set, selected for the wall art and home decor collection.', 'published', 4450.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.245151+00', '2026-11-26 13:21:10.245151+00'),
	('d83635d5-60ea-49ba-9be9-28cfa1fb09ce', 'makkah-madinah-scenic-frame-set', 'Makkah Madinah Scenic Frame Set', 'Makkah Madinah Scenic Frame Set, selected for the wall art and home decor collection.', 'published', 4450.00, 'PKR', NULL, 'NEW IN', '2026-11-26 13:21:10.248118+00', '2026-11-26 13:21:10.248118+00'),
	('c87b376e-6212-4fe1-b60a-cd9063784f46', 'premium-loh-e-qurani-calligraphy', 'Premium Loh-e-Qurani Calligraphy', 'Premium Loh-e-Qurani Calligraphy, selected for the wall art and home decor collection.', 'published', 1990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.251247+00', '2026-11-26 13:21:10.251247+00'),
	('a3b905ae-c332-435c-aa83-c8ce93593281', 'tasbeeh-e-fatima-wall-art', 'Tasbeeh-e-Fatima Wall Art', 'Tasbeeh-e-Fatima Wall Art, selected for the wall art and home decor collection.', 'published', 1890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.25452+00', '2026-11-26 13:21:10.25452+00'),
	('cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 'bismillah-alhamdulillah-pair', 'Bismillah Alhamdulillah Pair', 'Bismillah Alhamdulillah Pair, selected for the wall art and home decor collection.', 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.258792+00', '2026-11-26 13:21:10.258792+00'),
	('1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 'islamic-hexagon-wall-art-set', 'Islamic Hexagon Wall Art Set', 'Islamic Hexagon Wall Art Set, selected for the wall art and home decor collection.', 'published', 3290.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.262808+00', '2026-11-26 13:21:10.262808+00'),
	('e55e8505-7250-47e7-8fde-f0ac91d0099b', 'modern-islamic-home-decor-panel', 'Modern Islamic Home Decor Panel', 'Modern Islamic Home Decor Panel, selected for the wall art and home decor collection.', 'published', 2750.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.26628+00', '2026-11-26 13:21:10.26628+00'),
	('f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 'ayatul-kursi-acrylic-wall-decor', 'Ayatul Kursi Acrylic Wall Decor', 'Ayatul Kursi Acrylic Wall Decor, selected for the wall art and home decor collection.', 'published', 4990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.269686+00', '2026-11-26 13:21:10.269686+00'),
	('f4bb47dc-7deb-4777-8030-ea15cef0a263', 'contemporary-islamic-calligraphy', 'Contemporary Islamic Calligraphy', 'Contemporary Islamic Calligraphy, selected for the wall art and home decor collection.', 'published', 3690.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.272687+00', '2026-11-26 13:21:10.272687+00'),
	('90d33dcc-daef-4a1b-99a7-e7108a03ca47', 'surah-ikhlas-round-wall-plaque', 'Surah Ikhlas Round Wall Plaque', 'Surah Ikhlas Round Wall Plaque, selected for the wall art and home decor collection.', 'published', 2190.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.276047+00', '2026-11-26 13:21:10.276047+00'),
	('a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 'dua-e-nad-e-ali-wall-art', 'Dua-e-Nad-e-Ali Wall Art', 'Dua-e-Nad-e-Ali Wall Art, selected for the wall art and home decor collection.', 'published', 2490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.279079+00', '2026-11-26 13:21:10.279079+00'),
	('e0016288-fa07-42ce-be3c-d712d1833301', 'ramadan-kareem-calligraphy-decor', 'Ramadan Kareem Calligraphy Decor', 'Ramadan Kareem Calligraphy Decor, selected for the wall art and home decor collection.', 'published', 1990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.282754+00', '2026-11-26 13:21:10.282754+00'),
	('173aabab-f539-440c-a451-16e9ccba6f64', 'golden-ayat-calligraphy-panel', 'Golden Ayat Calligraphy Panel', 'Golden Ayat Calligraphy Panel, selected for the wall art and home decor collection.', 'published', 3990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.28668+00', '2026-11-26 13:21:10.28668+00'),
	('e4d94d3e-60da-4b28-8d8d-60354be08f01', 'islamic-geometric-calligraphy-set', 'Islamic Geometric Calligraphy Set', 'Islamic Geometric Calligraphy Set, selected for the wall art and home decor collection.', 'published', 4250.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.290925+00', '2026-11-26 13:21:10.290925+00'),
	('668de9a1-e76c-487e-82ed-935b5e13c22e', 'kaaba-masjid-al-haram-canvas-set', 'Kaaba Masjid Al-Haram Canvas Set', 'Kaaba Masjid Al-Haram Canvas Set, selected for the wall art and home decor collection.', 'published', 4990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.294831+00', '2026-11-26 13:21:10.294831+00'),
	('16168a3c-f848-43e1-904e-8ebefbc98a6f', 'sher-e-khuda-calligraphy-art', 'Sher-e-Khuda Calligraphy Art', 'Sher-e-Khuda Calligraphy Art, selected for the wall art and home decor collection.', 'published', 3490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.298823+00', '2026-11-26 13:21:10.298823+00'),
	('6df08ea7-ede2-49a1-8bda-813fda042b8e', 'minimalist-acrylic-allah-decor', 'Minimalist Acrylic Allah Decor', 'Minimalist Acrylic Allah Decor, selected for the wall art and home decor collection.', 'published', 2290.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.301611+00', '2026-11-26 13:21:10.301611+00'),
	('bd63f507-6f03-4c64-acdf-770aea8c4d91', 'modern-islamic-acrylic-wall-panel', 'Modern Islamic Acrylic Wall Panel', 'Modern Islamic Acrylic Wall Panel, selected for the wall art and home decor collection.', 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.304526+00', '2026-11-26 13:21:10.304526+00'),
	('73b9e4d5-a375-4653-bd5a-485a423fd912', 'islamic-wooden-frame-wall-decor', 'Islamic Wooden Frame Wall Decor', 'Islamic Wooden Frame Wall Decor, selected for the wall art and home decor collection.', 'published', 2690.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.307078+00', '2026-11-26 13:21:10.307078+00'),
	('be61789a-9a2f-4e54-b10a-31bdb39bcf16', 'allah-muhammad-scenic-wall-art', 'Allah Muhammad Scenic Wall Art', 'Allah Muhammad Scenic Wall Art, selected for the wall art and home decor collection.', 'published', 3990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.309733+00', '2026-11-26 13:21:10.309733+00'),
	('edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 'acrylic-mirror-flower-wall-set', 'Acrylic Mirror Flower Wall Set', 'Acrylic Mirror Flower Wall Set, selected for the wall art and home decor collection.', 'published', 1290.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.312464+00', '2026-11-26 13:21:10.312464+00'),
	('bb32bf45-9a50-4497-8a5c-34783c073e2c', 'geometric-acrylic-mirror-decor', 'Geometric Acrylic Mirror Decor', 'Geometric Acrylic Mirror Decor, selected for the wall art and home decor collection.', 'published', 1490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.315341+00', '2026-11-26 13:21:10.315341+00'),
	('bce22b2f-effa-4212-8a22-766b2f34f02a', 'modern-acrylic-wall-mirror-set', 'Modern Acrylic Wall Mirror Set', 'Modern Acrylic Wall Mirror Set, selected for the wall art and home decor collection.', 'published', 1990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.317986+00', '2026-11-26 13:21:10.317986+00'),
	('f09ad9fc-7c41-4714-b420-16c9ccb02b89', 'decorative-acrylic-mirror-tiles', 'Decorative Acrylic Mirror Tiles', 'Decorative Acrylic Mirror Tiles, selected for the wall art and home decor collection.', 'published', 990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.320749+00', '2026-11-26 13:21:10.320749+00'),
	('af07836e-75c4-4e9b-ab36-2f315ef8017d', 'diy-reflective-mirror-wall-decals', 'DIY Reflective Mirror Wall Decals', 'DIY Reflective Mirror Wall Decals, selected for the wall art and home decor collection.', 'published', 890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.323409+00', '2026-11-26 13:21:10.323409+00'),
	('9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 'silver-hexagon-mirror-decor', 'Silver Hexagon Mirror Decor', 'Silver Hexagon Mirror Decor, selected for the wall art and home decor collection.', 'published', 790.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.32602+00', '2026-11-26 13:21:10.32602+00'),
	('e9d377d4-5897-44fd-ae81-1a2d2f299145', 'gold-acrylic-islamic-wall-decor', 'Gold Acrylic Islamic Wall Decor', 'Gold Acrylic Islamic Wall Decor, selected for the wall art and home decor collection.', 'published', 3490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.329294+00', '2026-11-26 13:21:10.329294+00'),
	('3f85931f-ea9b-480c-b6c2-3411e575c185', 'modern-acrylic-calligraphy-wall-art', 'Modern Acrylic Calligraphy Wall Art', 'Modern Acrylic Calligraphy Wall Art, selected for the wall art and home decor collection.', 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.332644+00', '2026-11-26 13:21:10.332644+00'),
	('546758f9-a2a8-41f3-b628-506123efb59e', 'premium-gold-islamic-wall-hanging', 'Premium Gold Islamic Wall Hanging', 'Premium Gold Islamic Wall Hanging, selected for the wall art and home decor collection.', 'published', 3990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.335796+00', '2026-11-26 13:21:10.335796+00'),
	('180a86d4-6e10-4aeb-b238-8966b45d61e5', 'acrylic-ayat-ul-kursi-statement-art', 'Acrylic Ayat-ul-Kursi Statement Art', 'Acrylic Ayat-ul-Kursi Statement Art, selected for the wall art and home decor collection.', 'published', 5990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.338314+00', '2026-11-26 13:21:10.338314+00'),
	('a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 'decorative-acrylic-islamic-plaque', 'Decorative Acrylic Islamic Plaque', 'Decorative Acrylic Islamic Plaque, selected for the wall art and home decor collection.', 'published', 2490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.341003+00', '2026-11-26 13:21:10.341003+00'),
	('ac79712f-8018-48a6-a1c2-4b8bd97718b6', 'modern-gold-acrylic-wall-accents', 'Modern Gold Acrylic Wall Accents', 'Modern Gold Acrylic Wall Accents, selected for the wall art and home decor collection.', 'published', 1990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.343601+00', '2026-11-26 13:21:10.343601+00'),
	('e0380f4a-1830-40d9-a642-61962dc99f84', 'custom-family-name-wall-sign', 'Custom Family Name Wall Sign', 'Custom Family Name Wall Sign, selected for the wall art and home decor collection.', 'published', 3490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.346122+00', '2026-11-26 13:21:10.346122+00'),
	('d1b2b956-b73d-4317-9fab-817f4ef0309e', 'laser-cut-floral-wall-frame', 'Laser Cut Floral Wall Frame', 'Laser Cut Floral Wall Frame, selected for the wall art and home decor collection.', 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.348691+00', '2026-11-26 13:21:10.348691+00'),
	('6394b534-ac01-4e83-8bc4-b4e7c7b97120', 'decorative-quote-wall-plaque', 'Decorative Quote Wall Plaque', 'Decorative Quote Wall Plaque, selected for the wall art and home decor collection.', 'published', 1790.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.351389+00', '2026-11-26 13:21:10.351389+00'),
	('48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 'couple-name-personalized-wall-art', 'Couple Name Personalized Wall Art', 'Couple Name Personalized Wall Art, selected for the wall art and home decor collection.', 'published', 2490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.35468+00', '2026-11-26 13:21:10.35468+00'),
	('356dbafa-3027-4daf-8888-59d8de2957c0', 'wooden-islamic-wall-clock', 'Wooden Islamic Wall Clock', 'Wooden Islamic Wall Clock, selected for the wall art and home decor collection.', 'published', 2490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.3571+00', '2026-11-26 13:21:10.3571+00'),
	('65b72e18-cab5-4c72-aaac-747e9093267e', 'acrylic-islamic-wall-clock', 'Acrylic Islamic Wall Clock', 'Acrylic Islamic Wall Clock, selected for the wall art and home decor collection.', 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.359605+00', '2026-11-26 13:21:10.359605+00'),
	('8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 'birds-on-branches-pendulum-clock', 'Birds on Branches Pendulum Clock', 'Birds on Branches Pendulum Clock, selected for the wall art and home decor collection.', 'published', 4990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.362155+00', '2026-11-26 13:21:10.362155+00'),
	('1a77ec11-4222-4b3a-b482-49c6d36c529d', 'classic-designer-wall-clock', 'Classic Designer Wall Clock', 'Classic Designer Wall Clock, selected for the wall art and home decor collection.', 'published', 1890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.364591+00', '2026-11-26 13:21:10.364591+00'),
	('6ac0fcd0-1984-4236-acb1-3d97e561b943', 'modern-office-wall-clock', 'Modern Office Wall Clock', 'Modern Office Wall Clock, selected for the wall art and home decor collection.', 'published', 2290.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.367334+00', '2026-11-26 13:21:10.367334+00'),
	('1fd1e82f-4864-4473-a64c-9ca433878873', 'large-diy-statement-wall-clock', 'Large DIY Statement Wall Clock', 'Large DIY Statement Wall Clock, selected for the wall art and home decor collection.', 'published', 1499.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.369841+00', '2026-11-26 13:21:10.369841+00'),
	('e0b60e48-3336-4084-97da-9aa08977a2ad', 'islamic-calligraphy-clock-decor', 'Islamic Calligraphy Clock Decor', 'Islamic Calligraphy Clock Decor, selected for the wall art and home decor collection.', 'published', 3490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.372567+00', '2026-11-26 13:21:10.372567+00'),
	('cded907b-2494-4e6e-b8d8-5ab434bbd37e', 'neon-style-decorative-wall-clock', 'Neon Style Decorative Wall Clock', 'Neon Style Decorative Wall Clock, selected for the wall art and home decor collection.', 'published', 3990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.375015+00', '2026-11-26 13:21:10.375015+00'),
	('09b07e4a-209b-41e0-9343-a4650c533772', 'nature-reflection-canvas-art', 'Nature Reflection Canvas Art', 'Nature Reflection Canvas Art, selected for the wall art and home decor collection.', 'published', 3290.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.377566+00', '2026-11-26 13:21:10.377566+00'),
	('f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 'kids-learning-wall-art-set', 'Kids Learning Wall Art Set', 'Kids Learning Wall Art Set, selected for the wall art and home decor collection.', 'published', 2790.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.380044+00', '2026-11-26 13:21:10.380044+00'),
	('a8df81fd-7d1c-4bb0-9825-2d081774c10d', 'the-naqsh-trio-gold-black-engraved-nesting-tables-set-of-3-1', 'The Naqsh Trio – Gold & Black Engraved Nesting Tables (Set of 3)', NULL, 'published', 16400.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.382572+00', '2026-11-26 13:21:10.382572+00'),
	('d5c4195a-6841-46ca-83af-b4df011d7984', 'the-carrara-trio-white-marble-look-nesting-tables-set-of-3-2', 'The Carrara Trio – White Marble-Look Nesting Tables (Set of 3)', NULL, 'published', 14800.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.385017+00', '2026-11-26 13:21:10.385017+00'),
	('acc68cea-54b8-4248-a20d-291930c71f2a', 'the-xandra-trio-woodgrain-nesting-tables-set-of-3-3', 'The Xandra Trio – Woodgrain Nesting Tables (Set of 3)', NULL, 'published', 13500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.387488+00', '2026-11-26 13:21:10.387488+00'),
	('ddc38436-5ef4-4877-a360-4f05211911c7', 'royal-mandala-gold-black-engraved-nesting-tables-set-of-3-4', 'Royal Mandala Gold & Black Engraved Nesting Tables (Set of 3)', NULL, 'published', 14500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.389923+00', '2026-11-26 13:21:10.389923+00'),
	('7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 'the-contrast-duo-woodgrain-charcoal-nesting-coffee-tables-5', 'The Contrast Duo – Woodgrain & Charcoal Nesting Coffee Tables', NULL, 'published', 23999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.392096+00', '2026-11-26 13:21:10.392096+00'),
	('51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 'the-slate-trio-matte-charcoal-nesting-tables-set-of-3-6', 'The Slate Trio – Matte Charcoal Nesting Tables (Set of 3)', NULL, 'published', 13500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.394247+00', '2026-11-26 13:21:10.394247+00'),
	('2d557c88-c4be-4dba-94fc-f5d2206b8d78', 'wood-black-steel-round-nesting-tables-set-of-3-7', 'Wood & Black Steel Round Nesting Tables (Set of 3)', NULL, 'published', 13400.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.396471+00', '2026-11-26 13:21:10.396471+00'),
	('b98c1283-ecf9-4dcc-82a8-c081ba903de6', 'the-timber-trio-rustic-woodgrain-nesting-tables-set-of-3-8', 'The Timber Trio – Rustic Woodgrain Nesting Tables (Set of 3)', NULL, 'published', 14800.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.398537+00', '2026-11-26 13:21:10.398537+00'),
	('89d4c501-3d22-4929-a78a-5fcb5f2633d7', 'the-eclipse-duo-matte-charcoal-nesting-coffee-tables-set-of-2-9', 'The Eclipse Duo – Matte Charcoal Nesting Coffee Tables (Set of 2)', NULL, 'published', 24999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.400589+00', '2026-11-26 13:21:10.400589+00'),
	('eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 'the-nordic-trio-matte-honey-blonde-nesting-tables-set-of-3-10', 'The Nordic Trio – Matte Honey-Blonde Nesting Tables (Set of 3)', NULL, 'published', 13500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.402819+00', '2026-11-26 13:21:10.402819+00'),
	('0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 'the-cascade-trio-modern-wood-metal-side-tables-11', 'The Cascade Trio – Modern Wood & Metal Side Tables', NULL, 'published', 18500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.40519+00', '2026-11-26 13:21:10.40519+00'),
	('438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 'the-vertex-duo-modern-wood-metal-side-tables-12', 'The Vertex Duo – Modern Wood & Metal Side Tables', NULL, 'published', 9500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.407294+00', '2026-11-26 13:21:10.407294+00'),
	('86d8f03c-ab47-42ba-b97f-8f9e03798f03', 'the-crosswood-round-side-table-wood-black-steel-13', 'The Crosswood Round Side Table – Wood & Black Steel', NULL, 'published', 11500.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.409606+00', '2026-11-26 13:21:10.409606+00'),
	('aedebcae-88ec-49a1-9727-968e07c54a3d', '3-tier-wooden-steel-kitchen-serving-trolley-large-14', '3-Tier Wooden & Steel Kitchen Serving Trolley – Large', NULL, 'published', 14999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.412132+00', '2026-11-26 13:21:10.412132+00'),
	('cceec074-07a4-41e1-9686-373bbc7b90a6', 'the-lumaline-gold-geometric-led-table-lamp-touch-type-c-15', 'The LumaLine – Gold Geometric LED Table Lamp (Touch + Type-C)', NULL, 'published', 2490.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.414482+00', '2026-11-26 13:21:10.414482+00'),
	('877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 'the-aurelia-glow-luxury-gold-leaf-led-table-lamp-16', 'The Aurelia Glow – Luxury Gold Leaf LED Table Lamp', NULL, 'published', 2850.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.416724+00', '2026-11-26 13:21:10.416724+00'),
	('945ee356-4a88-45cc-ab3e-953158a5f89f', 'the-elara-glow-luxury-bedside-lamp-touch-type-c-17', 'The Elara Glow – Luxury Bedside Lamp (Touch + Type-C)', NULL, 'published', 2750.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.419006+00', '2026-11-26 13:21:10.419006+00'),
	('3810cd1c-785e-45b0-9156-b4c02e26015d', 'the-lumora-golden-crystal-table-lamp-touch-type-c-18', 'The Lumora – Golden Crystal Table Lamp (Touch + Type-C)', NULL, 'published', 2450.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.42182+00', '2026-11-26 13:21:10.42182+00'),
	('ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 'crystal-oval-led-table-lamp-touch-type-c-19', 'Crystal Oval LED Table Lamp (Touch + Type-C)', NULL, 'published', 2950.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.424904+00', '2026-11-26 13:21:10.424904+00'),
	('e602e9f1-8356-4943-8bbc-5dd731063740', 'barakah-mirror-acrylic-wall-decor-3-piece-set-20', 'Barakah Mirror Acrylic Wall Decor – 3 Piece Set', NULL, 'published', 1999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.427271+00', '2026-11-26 13:21:10.427271+00'),
	('6e3e291a-24f3-44cd-8510-4146fa4087a0', 'durood-shareef-acrylic-wall-art-2026-21', 'Durood Shareef Acrylic Wall Art 2026', NULL, 'published', 4999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.429601+00', '2026-11-26 13:21:10.429601+00'),
	('e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 'gold-acrylic-ayatul-kursi-wall-art-luxury-islamic-decor-22', 'Gold Acrylic Ayatul Kursi Wall Art – Luxury Islamic Decor', NULL, 'published', 5999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.431873+00', '2026-11-26 13:21:10.431873+00'),
	('0b774948-d62b-49f2-8658-62c86afd399e', 'ayatul-kursi-premium-calligraphy-rectangle-black-gold-23', 'Ayatul Kursi Premium Calligraphy – Rectangle (Black/Gold)', NULL, 'published', 6999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.434125+00', '2026-11-26 13:21:10.434125+00'),
	('b6f69257-b04c-404f-8067-2f18564b17cb', 'zulfiqar-e-ali-golden-black-premium-wall-art-24', 'Zulfiqar-e-Ali Golden/Black Premium Wall Art', NULL, 'published', 4999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.436694+00', '2026-11-26 13:21:10.436694+00'),
	('04722b45-b32f-4b52-8a6f-eb9560a6cc35', 'ayat-ul-kursi-grand-calligraphy-panel-24-48-in-25', 'Ayat-ul-Kursi Grand Calligraphy Panel (24 × 48 in)', NULL, 'published', 12999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.43905+00', '2026-11-26 13:21:10.43905+00'),
	('ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 'saif-e-ali-premium-wall-art-decor-26', 'Saif-e-Ali Premium Wall Art Decor', NULL, 'published', 4499.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.441381+00', '2026-11-26 13:21:10.441381+00'),
	('9bd5d093-51a0-4111-a0e9-a128790823a8', 'makka-kiswah-kaaba-door-madina-jali-acrylic-wall-decor-27', 'Makka Kiswah Kaaba Door / Madina Jali Acrylic Wall Decor', NULL, 'published', 6999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.443621+00', '2026-11-26 13:21:10.443621+00'),
	('76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 'divine-gold-asma-ul-husna-frame-acrylic-28', 'Divine Gold Asma-ul-Husna Frame Acrylic', NULL, 'published', 4999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.44625+00', '2026-11-26 13:21:10.44625+00'),
	('1dd08759-a527-4ce2-873b-91e0736787b9', 'start-with-bismillah-end-with-alhamdulillah-set-of-2-29', 'Start with Bismillah, End with Alhamdulillah – Set of 2', NULL, 'published', 1990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.448841+00', '2026-11-26 13:21:10.448841+00'),
	('0d157c92-7e5b-416a-b583-3d7848f9deb1', 'buy-1-get-2-free-calligraphies-30', 'Buy 1 Get 2 Free Calligraphies', NULL, 'published', 1699.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.451208+00', '2026-11-26 13:21:10.451208+00'),
	('96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 'zeenat-e-waqt-islamic-calligraphy-wall-clock-gold-black-31', 'Zeenat-e-Waqt – Islamic Calligraphy Wall Clock (Gold/Black)', NULL, 'published', 4999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.453566+00', '2026-11-26 13:21:10.453566+00'),
	('4a0fb052-d93c-48f0-b85a-359a2019e2da', 'noor-e-zaman-premium-wall-clock-set-3-panel-decor-32', 'Noor-e-Zaman Premium Wall Clock Set – 3 Panel Decor', NULL, 'published', 3999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.455952+00', '2026-11-26 13:21:10.455952+00'),
	('b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 'surah-ikhlas-wall-clock-33', 'Surah Ikhlas Wall Clock', NULL, 'published', 1699.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.458233+00', '2026-11-26 13:21:10.458233+00'),
	('81fac16a-0f41-4010-b77b-c445df6ef4e2', 'birds-on-branches-scenic-pendulum-clock-34', 'Birds on Branches Scenic Pendulum Clock', NULL, 'published', 1890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.460772+00', '2026-11-26 13:21:10.460772+00'),
	('d324d689-8609-485c-873c-be8a56440940', 'modern-acrylic-wall-clock-35', 'Modern Acrylic Wall Clock', NULL, 'published', 1790.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.463058+00', '2026-11-26 13:21:10.463058+00'),
	('b743b7db-272e-4e94-802e-7c8a222b5ece', 'world-map-wall-clock-36', 'World Map Wall Clock', NULL, 'published', 1799.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.465278+00', '2026-11-26 13:21:10.465278+00'),
	('42559937-d01a-4be6-b959-194d69bcdf97', 'large-size-wooden-diy-clock-with-12-inch-needles-37', 'Large Size Wooden DIY Clock with 12-Inch Needles', NULL, 'published', 1499.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.467605+00', '2026-11-26 13:21:10.467605+00'),
	('00024bd1-77ca-46c3-9748-b7b8218f2230', 'we-are-family-clock-with-white-dial-38', 'We Are Family Clock with White Dial', NULL, 'published', 1890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.469801+00', '2026-11-26 13:21:10.469801+00'),
	('80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 'modern-style-neon-x-clock-ambient-light-39', 'Modern Style Neon X Clock Ambient Light', NULL, 'published', 4799.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.47205+00', '2026-11-26 13:21:10.47205+00'),
	('93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 'neon-decorative-wall-art-clock-40', 'Neon Decorative Wall Art Clock', NULL, 'published', 3699.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.4744+00', '2026-11-26 13:21:10.4744+00'),
	('8602d310-085a-4f9d-8f61-a3dbc278fdc6', 'acrylic-hexagon-wall-decor-mirror-gold-41', 'Acrylic Hexagon Wall Decor Mirror (Gold)', NULL, 'published', 890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.476561+00', '2026-11-26 13:21:10.476561+00'),
	('8d2b0369-597e-42ab-b830-678091e8afb7', 'acrylic-hexagon-wall-decor-mirror-silver-42', 'Acrylic Hexagon Wall Decor Mirror (Silver)', NULL, 'published', 790.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.478871+00', '2026-11-26 13:21:10.478871+00'),
	('ffa8e850-e7ab-48c8-b098-93d692cc2b91', 'premium-acrylic-leaf-mirror-43', 'Premium Acrylic Leaf Mirror', NULL, 'published', 1999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.481162+00', '2026-11-26 13:21:10.481162+00'),
	('b65d6726-05d5-4582-a5f0-405c90d106e2', 'neon-selfie-acrylic-mirror-for-room-walls-44', 'Neon Selfie Acrylic Mirror for Room Walls', NULL, 'published', 2990.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.483398+00', '2026-11-26 13:21:10.483398+00'),
	('df5b2a8f-4d3e-4107-af13-1a709c857ebf', 'unbreakable-imported-acrylic-mirror-self-adhesive-45', 'Unbreakable Imported Acrylic Mirror (Self-Adhesive)', NULL, 'published', 1299.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.485845+00', '2026-11-26 13:21:10.485845+00'),
	('d4f0bfb5-0f08-4a26-a328-9f66778868f9', 'diy-miniature-shelves-wooden-46', 'DIY Miniature Shelves Wooden', NULL, 'published', 499.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.488254+00', '2026-11-26 13:21:10.488254+00'),
	('d7ce6a23-5c60-42ed-bf31-86b51a50aae6', 'led-candles-for-shelves-decor-47', 'LED Candles for Shelves Decor', NULL, 'published', 699.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.490542+00', '2026-11-26 13:21:10.490542+00'),
	('2e77c73e-df16-4867-aec2-a4e3e0f148e9', 'together-we-are-family-frames-12-frames-48', 'Together We Are Family Frames (12 Frames)', NULL, 'published', 1890.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.492803+00', '2026-11-26 13:21:10.492803+00'),
	('17124218-20c5-4358-be39-690fc31db672', 'kids-magic-practice-book-set-of-4-10-refill-pens-49', 'Kids Magic Practice Book Set of 4 + 10 Refill Pens', NULL, 'published', 1299.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.495055+00', '2026-11-26 13:21:10.495055+00'),
	('3f27581f-5e6b-469f-ae16-e3f40026e3f8', '3-in-1-wooden-montessori-board-vowels-numbers-shapes-50', '3-in-1 Wooden Montessori Board (Vowels, Numbers, Shapes)', NULL, 'published', 1999.00, 'PKR', NULL, NULL, '2026-11-26 13:21:10.497725+00', '2026-11-26 13:21:10.497725+00');


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_variants" ("id", "product_id", "sku", "title", "price_amount", "price_currency", "inventory_quantity", "is_default") VALUES
	('966c7cec-579b-4d26-ad19-24bfd8b1b156', '6da834f1-bb5a-497a-8da0-cd8956d87a1e', 'neck-roll-default', 'Default', 7000.00, 'PKR', 0, true),
	('4c52c1a1-618c-442d-af57-7636e540191b', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'capp-169-qf-rp-default', 'Default', 44500.00, 'PKR', 0, true),
	('e7602b6d-09fe-4334-8084-6709dec1a250', '01ccdd34-04f4-411e-825c-8fbd5c02e3c3', 'quran-cover-default', 'Default', 2750.00, 'PKR', 0, true),
	('bfc7b8b8-6420-4605-929d-b5b9ecbc5840', '988058e6-35a6-4712-b196-de7a8163df02', 'table-linen-default', 'Default', 9000.00, 'PKR', 0, true),
	('1fe1cd9e-2514-48b2-8b24-bd4bdabf99f8', 'f04da3e3-68d8-4e33-b2b0-22f07fd079bb', 'tw-445b-default', 'Default', 10900.00, 'PKR', 0, true),
	('758dae1d-8a7f-425a-b6b1-d88c06e9bfec', 'd7db06e3-41dc-46d6-a274-3cac867609c2', 'silk-plain-bed-sheet-set-default', 'Default', 12900.00, 'PKR', 0, true),
	('2c2ac856-cce1-4108-b025-e3decff50ff3', '15293447-0299-44dc-9a82-89dfe80c2c5c', 'khaise-default', 'Default', 14500.00, 'PKR', 0, true),
	('1566d9a8-d8d9-49f5-a75b-ae82467eda27', '31d3e3cd-5fbf-4e41-83bc-67a32f0aaa5d', 'sale-bedding-set-default', 'Default', 8990.00, 'PKR', 0, true),
	('28dc9170-29a3-4b2a-800f-01928a2d719e', '721474ef-7a33-4cc0-a787-bc0caf786599', 'sale-coverlet-default', 'Default', 7490.00, 'PKR', 0, true),
	('34badaea-410a-46f9-ae9d-7b92be030321', 'acba90d4-9ce6-454d-b97b-b72f62de2023', '99-names-of-allah-calligraphy-default', 'Default', 3999.00, 'PKR', 0, true),
	('b0256e68-0113-4f40-9c89-b6cd4df32700', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 'bismillah-islamic-wall-plaque-default', 'Default', 2490.00, 'PKR', 0, true),
	('3b4d791f-d9bd-4e7a-9844-5510a910bcdc', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 'alhamdulillah-calligraphy-panel-default', 'Default', 2890.00, 'PKR', 0, true),
	('8cfbabbb-7081-411c-9553-a82f3ae20b7f', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 'ayatul-kursi-wooden-wall-art-default', 'Default', 3490.00, 'PKR', 0, true),
	('2a8b0ba8-0c65-4770-812a-002bf416a532', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 'allah-muhammad-twin-calligraphy-set-default', 'Default', 4450.00, 'PKR', 0, true),
	('95ac16b9-898b-4a83-bc1a-29d0378b72ab', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 'makkah-madinah-scenic-frame-set-default', 'Default', 4450.00, 'PKR', 0, true),
	('8a07fb65-8da9-42aa-8f6d-1d255ae57478', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 'premium-loh-e-qurani-calligraphy-default', 'Default', 1990.00, 'PKR', 0, true),
	('074bf634-24af-4709-b051-1eb3b03154fa', 'a3b905ae-c332-435c-aa83-c8ce93593281', 'tasbeeh-e-fatima-wall-art-default', 'Default', 1890.00, 'PKR', 0, true),
	('6167b92a-654d-45d1-931b-4a65c61fd1d1', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 'bismillah-alhamdulillah-pair-default', 'Default', 2990.00, 'PKR', 0, true),
	('52f77a98-3e8b-4054-8a5a-790cd9c7b475', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 'islamic-hexagon-wall-art-set-default', 'Default', 3290.00, 'PKR', 0, true),
	('e9ead171-bae2-4d3b-92db-ce39bb2d46cd', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 'modern-islamic-home-decor-panel-default', 'Default', 2750.00, 'PKR', 0, true),
	('c1d28a23-8f1d-4490-816e-21b2d21c98c2', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 'ayatul-kursi-acrylic-wall-decor-default', 'Default', 4990.00, 'PKR', 0, true),
	('e7e94efc-21ed-4efd-a1e8-e1f1a1d0c7bc', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 'contemporary-islamic-calligraphy-default', 'Default', 3690.00, 'PKR', 0, true),
	('23eaf6fd-320e-47eb-b2d2-3fac3e59cb7f', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 'surah-ikhlas-round-wall-plaque-default', 'Default', 2190.00, 'PKR', 0, true),
	('2b079dc5-ae02-43ef-a739-334aa153798c', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 'dua-e-nad-e-ali-wall-art-default', 'Default', 2490.00, 'PKR', 0, true),
	('6ad82e7b-21ca-4220-86d2-3d356be76a6e', 'e0016288-fa07-42ce-be3c-d712d1833301', 'ramadan-kareem-calligraphy-decor-default', 'Default', 1990.00, 'PKR', 0, true),
	('cca54bda-8ecd-4676-a3e9-c5ecda7b8695', '173aabab-f539-440c-a451-16e9ccba6f64', 'golden-ayat-calligraphy-panel-default', 'Default', 3990.00, 'PKR', 0, true),
	('889967a5-11ae-46ab-bfcc-5ed0fde80b98', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 'islamic-geometric-calligraphy-set-default', 'Default', 4250.00, 'PKR', 0, true),
	('b659cc05-6ba2-492e-b6ca-dbba3ec273c9', '668de9a1-e76c-487e-82ed-935b5e13c22e', 'kaaba-masjid-al-haram-canvas-set-default', 'Default', 4990.00, 'PKR', 0, true),
	('92a6cb82-1905-4426-b48f-136f48d85533', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 'sher-e-khuda-calligraphy-art-default', 'Default', 3490.00, 'PKR', 0, true),
	('f0c40166-9c1b-4beb-9467-e760261f6328', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 'minimalist-acrylic-allah-decor-default', 'Default', 2290.00, 'PKR', 0, true),
	('1d91176a-5f03-47d6-a467-1789b5da5c68', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 'modern-islamic-acrylic-wall-panel-default', 'Default', 2990.00, 'PKR', 0, true),
	('92390a77-f9c8-47b6-91c7-967e399a321c', '73b9e4d5-a375-4653-bd5a-485a423fd912', 'islamic-wooden-frame-wall-decor-default', 'Default', 2690.00, 'PKR', 0, true),
	('dd90130a-e26b-4781-b7bc-58bfda7326a1', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 'allah-muhammad-scenic-wall-art-default', 'Default', 3990.00, 'PKR', 0, true),
	('a1ae3b3f-4721-4c56-aea2-470f697fbba4', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 'acrylic-mirror-flower-wall-set-default', 'Default', 1290.00, 'PKR', 0, true),
	('6358fbee-375f-4ba4-8da7-4285d3ac995a', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 'geometric-acrylic-mirror-decor-default', 'Default', 1490.00, 'PKR', 0, true),
	('f060b005-6976-4f48-80f1-78ad6eb2b515', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 'modern-acrylic-wall-mirror-set-default', 'Default', 1990.00, 'PKR', 0, true),
	('eedeac35-8efd-4e06-86c0-1a6c837425b2', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 'decorative-acrylic-mirror-tiles-default', 'Default', 990.00, 'PKR', 0, true),
	('ba608d59-073e-4f0a-80d6-9fa9ae6a8bf4', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 'diy-reflective-mirror-wall-decals-default', 'Default', 890.00, 'PKR', 0, true),
	('23f34c5b-5b32-4865-b577-424451f53bfd', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 'silver-hexagon-mirror-decor-default', 'Default', 790.00, 'PKR', 0, true),
	('e32aeaad-b83a-47e0-b721-f826c16c7744', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 'gold-acrylic-islamic-wall-decor-default', 'Default', 3490.00, 'PKR', 0, true),
	('ac0cfa99-1ec2-4567-9f3e-47a99d01ba2a', '3f85931f-ea9b-480c-b6c2-3411e575c185', 'modern-acrylic-calligraphy-wall-art-default', 'Default', 2990.00, 'PKR', 0, true),
	('ab5f778c-f49c-444b-84e1-f6c024ea935b', '546758f9-a2a8-41f3-b628-506123efb59e', 'premium-gold-islamic-wall-hanging-default', 'Default', 3990.00, 'PKR', 0, true),
	('c252c22c-3132-406f-bb53-9fb7e2e61fb9', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 'acrylic-ayat-ul-kursi-statement-art-default', 'Default', 5990.00, 'PKR', 0, true),
	('9289b0ec-c2e6-45a4-aa67-5fdc63275797', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 'decorative-acrylic-islamic-plaque-default', 'Default', 2490.00, 'PKR', 0, true),
	('87c0ec17-bbdb-4fa4-ab45-1bf3e1ca2bfb', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 'modern-gold-acrylic-wall-accents-default', 'Default', 1990.00, 'PKR', 0, true),
	('a052c0bc-1942-49b3-8cda-a75eaae8ac1f', 'e0380f4a-1830-40d9-a642-61962dc99f84', 'custom-family-name-wall-sign-default', 'Default', 3490.00, 'PKR', 0, true),
	('e81147e4-e9b4-4c93-b64b-cf41da7065d7', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 'laser-cut-floral-wall-frame-default', 'Default', 2990.00, 'PKR', 0, true),
	('64661bbd-75db-4881-8b45-32b362bb5ff7', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 'decorative-quote-wall-plaque-default', 'Default', 1790.00, 'PKR', 0, true),
	('8e94d423-de32-4800-a3a8-f31c94138664', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 'couple-name-personalized-wall-art-default', 'Default', 2490.00, 'PKR', 0, true),
	('86a3b415-2a3e-4012-8665-7995c2464faf', '356dbafa-3027-4daf-8888-59d8de2957c0', 'wooden-islamic-wall-clock-default', 'Default', 2490.00, 'PKR', 0, true),
	('a36d4ec5-e274-417d-98c8-192988422c4b', '65b72e18-cab5-4c72-aaac-747e9093267e', 'acrylic-islamic-wall-clock-default', 'Default', 2990.00, 'PKR', 0, true),
	('8a33f80f-5955-443d-999b-bf2fae22e628', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 'birds-on-branches-pendulum-clock-default', 'Default', 4990.00, 'PKR', 0, true),
	('6e4bbdbc-17c6-4447-8c30-8bfda0217286', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 'classic-designer-wall-clock-default', 'Default', 1890.00, 'PKR', 0, true),
	('6ff65692-8458-405d-8199-73de3c8cbede', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 'modern-office-wall-clock-default', 'Default', 2290.00, 'PKR', 0, true),
	('988d2fc0-084b-473e-8059-db52fac7d1da', '1fd1e82f-4864-4473-a64c-9ca433878873', 'large-diy-statement-wall-clock-default', 'Default', 1499.00, 'PKR', 0, true),
	('cdfdbd1a-23dd-4eab-b80a-6adc025405ab', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 'islamic-calligraphy-clock-decor-default', 'Default', 3490.00, 'PKR', 0, true),
	('c56c2cbe-3cb2-4d9a-b28f-7b9529585c28', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 'neon-style-decorative-wall-clock-default', 'Default', 3990.00, 'PKR', 0, true),
	('37f77d33-801a-42c1-822c-1c94a854ca57', '09b07e4a-209b-41e0-9343-a4650c533772', 'nature-reflection-canvas-art-default', 'Default', 3290.00, 'PKR', 0, true),
	('f6ada290-e334-41ef-968c-7a997e1dc72c', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 'kids-learning-wall-art-set-default', 'Default', 2790.00, 'PKR', 0, true),
	('717f3895-1ab1-473c-8bae-0eb72913331e', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 'the-naqsh-trio-gold-black-engraved-nesting-tables-set-of-3-1-default', 'Default', 16400.00, 'PKR', 0, true),
	('b9defac9-f75b-4a9f-ad3d-c774e9180d33', 'd5c4195a-6841-46ca-83af-b4df011d7984', 'the-carrara-trio-white-marble-look-nesting-tables-set-of-3-2-default', 'Default', 14800.00, 'PKR', 0, true),
	('b5641adf-f1a2-4933-b041-bf61e04466fc', 'acc68cea-54b8-4248-a20d-291930c71f2a', 'the-xandra-trio-woodgrain-nesting-tables-set-of-3-3-default', 'Default', 13500.00, 'PKR', 0, true),
	('c5b037a1-7ab5-429b-87cd-eeb5549b9bd4', 'ddc38436-5ef4-4877-a360-4f05211911c7', 'royal-mandala-gold-black-engraved-nesting-tables-set-of-3-4-default', 'Default', 14500.00, 'PKR', 0, true),
	('e418a25b-8d29-459c-9c18-a71fe4fc2907', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 'the-contrast-duo-woodgrain-charcoal-nesting-coffee-tables-5-default', 'Default', 23999.00, 'PKR', 0, true),
	('a5194dcf-2cc0-4822-9962-60614a692240', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 'the-slate-trio-matte-charcoal-nesting-tables-set-of-3-6-default', 'Default', 13500.00, 'PKR', 0, true),
	('51521c5a-218c-4154-8361-e4503b110b65', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 'wood-black-steel-round-nesting-tables-set-of-3-7-default', 'Default', 13400.00, 'PKR', 0, true),
	('c2e4a4b2-22ef-42a4-b5c8-71fd69796ffd', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 'the-timber-trio-rustic-woodgrain-nesting-tables-set-of-3-8-default', 'Default', 14800.00, 'PKR', 0, true),
	('959fa358-6c6f-4a65-a90e-5e3df41d82d5', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 'the-eclipse-duo-matte-charcoal-nesting-coffee-tables-set-of-2-9-default', 'Default', 24999.00, 'PKR', 0, true),
	('7e2f70af-dfaf-4cdb-bbc2-101705725052', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 'the-nordic-trio-matte-honey-blonde-nesting-tables-set-of-3-10-default', 'Default', 13500.00, 'PKR', 0, true),
	('562dd37d-86fe-409a-abd3-a581496e9623', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 'the-cascade-trio-modern-wood-metal-side-tables-11-default', 'Default', 18500.00, 'PKR', 0, true),
	('60606e1a-b150-42cc-b21d-5093557090fb', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 'the-vertex-duo-modern-wood-metal-side-tables-12-default', 'Default', 9500.00, 'PKR', 0, true),
	('4bd6d967-0f7d-4354-869c-42ab15c40cf5', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 'the-crosswood-round-side-table-wood-black-steel-13-default', 'Default', 11500.00, 'PKR', 0, true),
	('b7f53ba6-b7c2-45c3-994f-1325588b56cf', 'aedebcae-88ec-49a1-9727-968e07c54a3d', '3-tier-wooden-steel-kitchen-serving-trolley-large-14-default', 'Default', 14999.00, 'PKR', 0, true),
	('1178978f-cfa3-44e9-85b8-07131dc2ae57', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 'the-lumaline-gold-geometric-led-table-lamp-touch-type-c-15-default', 'Default', 2490.00, 'PKR', 0, true),
	('0410314c-3493-4aa9-a27a-5d322311c8a4', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 'the-aurelia-glow-luxury-gold-leaf-led-table-lamp-16-default', 'Default', 2850.00, 'PKR', 0, true),
	('42188ec6-0d4c-409d-918e-0e5b3c7fe64b', '945ee356-4a88-45cc-ab3e-953158a5f89f', 'the-elara-glow-luxury-bedside-lamp-touch-type-c-17-default', 'Default', 2750.00, 'PKR', 0, true),
	('43486c62-aa57-49d1-a4f0-a17cf49b14a8', '3810cd1c-785e-45b0-9156-b4c02e26015d', 'the-lumora-golden-crystal-table-lamp-touch-type-c-18-default', 'Default', 2450.00, 'PKR', 0, true),
	('406acda2-b69a-4ffb-9e2e-ae92cc1bf66b', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 'crystal-oval-led-table-lamp-touch-type-c-19-default', 'Default', 2950.00, 'PKR', 0, true),
	('9e9a1f33-6620-42b6-accb-f5a772f26666', 'e602e9f1-8356-4943-8bbc-5dd731063740', 'barakah-mirror-acrylic-wall-decor-3-piece-set-20-default', 'Default', 1999.00, 'PKR', 0, true),
	('3196d24f-2b21-4461-9544-cfec1646220a', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 'durood-shareef-acrylic-wall-art-2026-21-default', 'Default', 4999.00, 'PKR', 0, true),
	('d5675d55-169c-443a-ba97-633a1d3a6aae', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 'gold-acrylic-ayatul-kursi-wall-art-luxury-islamic-decor-22-default', 'Default', 5999.00, 'PKR', 0, true),
	('ee146d66-229b-4ea8-9687-b64ba8986634', '0b774948-d62b-49f2-8658-62c86afd399e', 'ayatul-kursi-premium-calligraphy-rectangle-black-gold-23-default', 'Default', 6999.00, 'PKR', 0, true),
	('3ce2b655-1a9d-48b3-b8c8-6634982a11b6', 'b6f69257-b04c-404f-8067-2f18564b17cb', 'zulfiqar-e-ali-golden-black-premium-wall-art-24-default', 'Default', 4999.00, 'PKR', 0, true),
	('b322eebc-f653-4ab1-8e00-4c5a993d147a', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 'ayat-ul-kursi-grand-calligraphy-panel-24-48-in-25-default', 'Default', 12999.00, 'PKR', 0, true),
	('e00263fc-d160-4691-bfb1-931ddfd51481', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 'saif-e-ali-premium-wall-art-decor-26-default', 'Default', 4499.00, 'PKR', 0, true),
	('d00f9838-ecc7-4733-9668-4686a6dc15ab', '9bd5d093-51a0-4111-a0e9-a128790823a8', 'makka-kiswah-kaaba-door-madina-jali-acrylic-wall-decor-27-default', 'Default', 6999.00, 'PKR', 0, true),
	('2b482725-124a-453e-8762-68a6d5c5e1b6', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 'divine-gold-asma-ul-husna-frame-acrylic-28-default', 'Default', 4999.00, 'PKR', 0, true),
	('2b87b0ed-2cb2-4575-8b08-970741ab436f', '1dd08759-a527-4ce2-873b-91e0736787b9', 'start-with-bismillah-end-with-alhamdulillah-set-of-2-29-default', 'Default', 1990.00, 'PKR', 0, true),
	('6ac31c46-1985-429f-baed-59fb960f4c20', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 'buy-1-get-2-free-calligraphies-30-default', 'Default', 1699.00, 'PKR', 0, true),
	('0d1521f4-83bb-452b-a27e-15a7704d6355', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 'zeenat-e-waqt-islamic-calligraphy-wall-clock-gold-black-31-default', 'Default', 4999.00, 'PKR', 0, true),
	('f4652512-3748-4a58-9c2e-ffa451109e59', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 'noor-e-zaman-premium-wall-clock-set-3-panel-decor-32-default', 'Default', 3999.00, 'PKR', 0, true),
	('438c39b0-02bc-4ce9-af36-15d9809604fb', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 'surah-ikhlas-wall-clock-33-default', 'Default', 1699.00, 'PKR', 0, true),
	('ecfaa74b-0236-4e17-bab9-b81070de4877', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 'birds-on-branches-scenic-pendulum-clock-34-default', 'Default', 1890.00, 'PKR', 0, true),
	('7eec497c-8153-4d9d-be9a-1b1cbda47c2a', 'd324d689-8609-485c-873c-be8a56440940', 'modern-acrylic-wall-clock-35-default', 'Default', 1790.00, 'PKR', 0, true),
	('24ea5216-eaad-484c-a314-39176c1d5e8a', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 'world-map-wall-clock-36-default', 'Default', 1799.00, 'PKR', 0, true),
	('6cedc612-b8b3-4766-8399-6c24af07906e', '42559937-d01a-4be6-b959-194d69bcdf97', 'large-size-wooden-diy-clock-with-12-inch-needles-37-default', 'Default', 1499.00, 'PKR', 0, true),
	('c2931a45-868e-405f-9635-4b6f2fbfe9c2', '00024bd1-77ca-46c3-9748-b7b8218f2230', 'we-are-family-clock-with-white-dial-38-default', 'Default', 1890.00, 'PKR', 0, true),
	('d2a2b23a-cc33-40b3-b555-408cde8af7c5', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 'modern-style-neon-x-clock-ambient-light-39-default', 'Default', 4799.00, 'PKR', 0, true),
	('d3d7c91d-521b-4d9c-a2ce-867f46335522', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 'neon-decorative-wall-art-clock-40-default', 'Default', 3699.00, 'PKR', 0, true),
	('87c06df0-a707-4e7b-879c-6d03b5d7661c', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 'acrylic-hexagon-wall-decor-mirror-gold-41-default', 'Default', 890.00, 'PKR', 0, true),
	('fbcb6524-2064-41bb-a806-9b4d16bbec98', '8d2b0369-597e-42ab-b830-678091e8afb7', 'acrylic-hexagon-wall-decor-mirror-silver-42-default', 'Default', 790.00, 'PKR', 0, true),
	('81f1e967-b9ed-4b6b-9aaa-d1ca81a27084', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 'premium-acrylic-leaf-mirror-43-default', 'Default', 1999.00, 'PKR', 0, true),
	('85c8e8e8-6866-4d81-b43e-b58717a4e131', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 'neon-selfie-acrylic-mirror-for-room-walls-44-default', 'Default', 2990.00, 'PKR', 0, true),
	('65aacd66-50db-47c0-9be6-107b7d6cb9c6', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 'unbreakable-imported-acrylic-mirror-self-adhesive-45-default', 'Default', 1299.00, 'PKR', 0, true),
	('c17dca0f-212d-47dd-b09a-62965f95b53b', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 'diy-miniature-shelves-wooden-46-default', 'Default', 499.00, 'PKR', 0, true),
	('3353e773-c54d-4693-aad5-c2d3ff75a8cb', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 'led-candles-for-shelves-decor-47-default', 'Default', 699.00, 'PKR', 0, true),
	('cc2c36ff-342f-46c1-a4c8-3aea4e3ef2a9', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 'together-we-are-family-frames-12-frames-48-default', 'Default', 1890.00, 'PKR', 0, true),
	('561bbb13-5436-4022-b5f3-e556e61cbe1c', '17124218-20c5-4358-be39-690fc31db672', 'kids-magic-practice-book-set-of-4-10-refill-pens-49-default', 'Default', 1299.00, 'PKR', 0, true),
	('bbec3977-470c-4751-9687-b83ba5519a45', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', '3-in-1-wooden-montessori-board-vowels-numbers-shapes-50-default', 'Default', 1999.00, 'PKR', 0, true);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "slug", "name", "parent_id", "sort_order") VALUES
	('00fa5986-1ac1-432e-a974-74805bdb1bdf', 'new-in', 'NEW IN', NULL, 0),
	('173b8d27-94a9-4104-88ca-74dd899b86ca', 'new-in-shop', 'SHOP NEW IN', NULL, 0),
	('f86cbeff-9576-43e0-81fc-b9fdb4fd7dad', 'new-in-bedding', 'BEDDING', NULL, 0),
	('db400a4b-bdbf-4cdc-b820-1e671f098cf3', 'new-in-home-decor', 'HOME DECOR', NULL, 0),
	('0bb82ee0-b28b-4ea7-86e1-04cbf3c46294', 'new-in-baby', 'BABY & NURSERY', NULL, 0),
	('c515f836-2bb3-4f43-92cf-06a9c7c20f85', 'new-in-wall-art', 'CANVAS & WALL ART', NULL, 0),
	('1bb51f51-9bb1-4135-aa7c-73340a874abb', 'new-in-curtains', 'CURTAINS & BLINDS', NULL, 0),
	('d0a8e56b-e5a4-4234-b2f9-323f1fe39ffe', 'home-decor', 'HOME DECOR', NULL, 0),
	('093bd434-11ab-4d72-882e-2ab0ff908e8f', 'home-decor-luxury', 'LUXURY HOME DECOR', NULL, 0),
	('c17a5066-d5de-44dc-a53f-59c2a8321568', 'decorative-showpieces', 'Decorative Showpieces', NULL, 0),
	('a9c4c841-c458-42b2-ba9a-87ffda875df2', 'table-decor', 'Table Decor', NULL, 0),
	('408e5aa6-7a22-4e40-ab2f-24b3c3212a9c', 'planters', 'Planters', NULL, 0),
	('b5fe73a7-f771-4b42-a1ba-69d13a6e0071', 'cushion-covers', 'Cushion Covers', NULL, 0),
	('f746ca3d-8514-4992-9565-f4d56ca4bcf0', 'accessories', 'Accessories', NULL, 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', 'led-lamps', 'LED Lamps', NULL, 0),
	('fcfb889f-e31e-49ba-843d-fa3e8bd57be9', 'shelves', 'Shelves & Storage', NULL, 0),
	('d0e828cf-6ffd-43c9-b978-8b86f4404c07', 'decorative-frames', 'Decorative Frames', NULL, 0),
	('29c4d77a-4684-47cd-bdcc-1482eea162cb', 'home-decor-curtains', 'CURTAINS AND BLINDS', NULL, 0),
	('9b1117e3-5c09-418b-a073-b11967ca677c', 'luxury-velvet-curtains', 'Luxury Velvet Curtains', NULL, 0),
	('3934e131-cffa-4c55-ba37-88209e51d9af', 'jacquard-curtains', 'Jacquard Curtains', NULL, 0),
	('75a0d9ed-141e-41a0-8f0a-17ed41bb4fa6', 'premium-curtains', 'Premium Curtains', NULL, 0),
	('94576d76-fa7a-47c7-842f-b5ecba49b085', 'gradient-double-shaded-curtains', 'Gradient Double Shaded', NULL, 0),
	('cde1ef04-fa5b-4329-bb86-c1ff619b93d4', 'laser-cutwork-curtains', 'Laser Cutwork', NULL, 0),
	('de5278b3-7db1-4c95-898c-e0cecdd10983', 'curtain-accessories', 'Accessories & Railings', NULL, 0),
	('08e529db-7fc7-46e2-a66d-309cfe81a4b4', 'home-decor-furniture', 'FURNITURE', NULL, 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'tables-consoles', 'Tables & Consoles', NULL, 0),
	('0cafaf94-0d19-4ef7-acde-fc4e94a52235', 'ottoman-stools', 'Ottoman Stools', NULL, 0),
	('b560137a-d14d-4afa-a9d3-3b6c5e052fb1', 'serving-trolleys', 'Serving Trolleys', NULL, 0),
	('694b59c0-9bd5-4310-ac2a-18cbceea741f', 'home-decor-blinds', 'PREMIUM BLINDS', NULL, 0),
	('a029057a-2c4e-4417-8d2e-56b34a75fc08', 'premium-blinds', 'Premium Blinds', NULL, 0),
	('aea90125-ed40-49cd-827c-46d7786434af', 'roller-blinds', 'Roller Blinds', NULL, 0),
	('c57aa18d-d9c6-404a-8636-369fa645f3f7', 'roman-blinds', 'Roman Blinds', NULL, 0),
	('9850bdc7-d4f1-471a-96c9-beea30dbce4e', 'zebra-blinds', 'Zebra Blinds', NULL, 0),
	('d3137a47-95d8-42bf-b0dd-2bdaaa8850f9', 'baby-and-nursery', 'BABY & NURSERY', NULL, 0),
	('a0f36676-f0be-4057-8e9a-89bb4027bfdb', 'baby-sleep-comfort', 'SLEEP & COMFORT', NULL, 0),
	('18e61e9f-d316-4d91-8198-4bb422f584eb', 'baby-bassinets', 'Baby Bassinets', NULL, 0),
	('70eb4b4d-398a-4784-ad5f-a9b47051feec', 'carry-nests', 'Carry Nests', NULL, 0),
	('e8b46c3b-2105-4c50-84b9-9d0b540f0708', 'baby-cot-sets', 'Baby Cot Sets', NULL, 0),
	('e45a7c69-7723-48fc-829f-dfb95e6692b5', 'snuggle-beds', 'Snuggle Beds', NULL, 0),
	('abd47410-e22e-4f0b-8753-4540a0f0aa65', 'baby-comforter-sets', 'Baby Comforter Sets', NULL, 0),
	('ed701ac7-e609-42b9-a49e-b75c18b8f14d', 'baby-nursery-essentials', 'NURSERY ESSENTIALS', NULL, 0),
	('a1b83ea8-b268-4bc2-8a17-67333876fb7a', 'kids-nursery-sets', 'Kids Nursery Sets', NULL, 0),
	('64f517ff-44ca-49b1-93a0-34021f102738', 'baby-support-seats', 'Baby Support Seats', NULL, 0),
	('3da813a8-dddd-4bf7-b444-7fbb14c317b5', 'storage-baskets', 'Storage Baskets', NULL, 0),
	('3885c1d0-fd4c-4b98-a822-75812465f727', 'cot-accessories', 'Cot Accessories', NULL, 0),
	('39b92950-e50f-4fa2-b39b-6eeb5add63c7', 'nursery-bedding', 'Nursery Bedding', NULL, 0),
	('f72e3763-68e4-4ec2-9228-d701d84a3ac7', 'kids-learning-tools', 'Kids Learning Tools', NULL, 0),
	('ff2d2fc0-e5a5-4675-bead-bb0479769fd8', 'baby-shop-services', 'SHOP & SERVICES', NULL, 0),
	('51277efd-fba8-4776-9d7e-0fad6965818b', 'new-arrivals', 'New Arrivals', NULL, 0),
	('33e7819f-0c11-43f5-b588-f0331c9f2596', 'best-sellers', 'Best Sellers', NULL, 0),
	('ddb03268-fbb8-4fed-8229-4d8a6cbe8933', 'custom-made-sets', 'Custom-Made Sets', NULL, 0),
	('28da16d2-0007-4a91-921f-aea9c29ba8e3', 'wholesale-enquiries', 'Wholesale Enquiries', NULL, 0),
	('4694603d-d2e3-49bb-b201-73b62ab96a7f', 'bedding', 'BEDDING', NULL, 0),
	('1acf8b9c-c373-4220-9a6f-9d8fb527ae36', 'bedding-bed-linen', 'BED LINEN', NULL, 0),
	('5d8c543c-ae63-4e1a-a346-90f680ad84be', 'bedsheets', 'Bedsheets', NULL, 0),
	('47fb1221-02e4-4a30-81c5-97a0373e2a5d', 'velvet-bedsheets', 'Velvet Bedsheets', NULL, 0),
	('1da30d71-2486-408e-997e-d46ba356cb37', 'designer-bedsheets', 'Designer Bedsheets', NULL, 0),
	('07970ef9-53b3-4e98-afc1-eb6dfebd77a8', 'pillow-covers', 'Pillow Covers', NULL, 0),
	('0b943489-a2e0-4f5b-ac24-6e211c86792e', 'bed-runners', 'Bed Runners', NULL, 0),
	('30ac87ca-3a95-4146-8853-bc9e94050d17', 'bedspreads', 'Bedspreads', NULL, 0),
	('0c5c2c6f-37d9-47ed-bd66-c4dc3f306c67', 'bedding-essentials', 'BEDDING ESSENTIALS', NULL, 0),
	('b50fc836-4b7a-4b87-ba68-b65ade689c06', 'mattress-protectors', 'Mattress Protectors', NULL, 0),
	('11baf5e8-3731-4ae2-9e3a-2c693ecf0ba7', 'mattress-toppers', 'Mattress Toppers', NULL, 0),
	('776006e6-b7f7-4e0f-8353-c3f5eb81c35f', 'bedding-cushion-fillings', 'Bedding & Cushion Fillings', NULL, 0),
	('12083a2f-0fc1-41a3-8a9e-26600d083584', 'blankets-throws', 'Blankets & Throws', NULL, 0),
	('de5c70cc-dbb3-4ad2-b06e-d7435dcbdfe6', 'bedding-comfort-luxury', 'COMFORT & LUXURY', NULL, 0),
	('0360761a-4f50-4b96-8751-b65e1a6766f0', 'luxury-bridal-bedding', 'Luxury Bridal Bedding', NULL, 0),
	('7de6e462-402e-4b48-a18c-c8d8251f4dba', 'comforter-sets', 'Comforter Sets', NULL, 0),
	('9c7f4689-313a-440b-8524-ed8f04d0f46c', 'duvet-sets', 'Duvet Sets', NULL, 0),
	('76bdefcd-25e8-4c67-a966-39d6ab10ccc5', 'quilts', 'Quilts', NULL, 0),
	('6e0cc868-c458-4610-95e5-c0bf65ebd270', 'custom-made-bedding', 'Custom-Made Bedding', NULL, 0),
	('477369f0-ccf6-476e-9466-9cb3e9f178dc', 'bedding-kitchen-linen', 'KITCHEN LINEN', NULL, 0),
	('962202c9-9225-4d65-baab-284781372c19', 'table-runners', 'Table Runners', NULL, 0),
	('7b12018d-0f86-4a2c-a7f6-5a84fbdf81a0', 'table-mats', 'Table Mats', NULL, 0),
	('e8d59294-6c9f-4041-8474-6fa290cf7e19', 'table-covers', 'Table Covers', NULL, 0),
	('f67f4488-5ee3-4dbc-8625-3ce40a9fa673', 'cloth-napkins', 'Cloth Napkins', NULL, 0),
	('d82c5a87-8118-46cd-8db2-37e1bd6039c2', 'kitchen-aprons', 'Kitchen Aprons', NULL, 0),
	('192673fb-ba85-4d9e-9a5e-9ea1ff0399a1', 'bedding-islamic-essentials', 'ISLAMIC ESSENTIALS', NULL, 0),
	('7a3a35d4-94c6-4e16-a520-4091b816cc18', 'prayer-mats', 'Prayer Mats', NULL, 0),
	('4af276e0-f122-425a-847a-1e3634a89f3a', 'personalized-prayer-mats', 'Personalized Prayer Mats', NULL, 0),
	('aa34034e-a8d8-4baf-8ec3-ca029ea28e37', 'couple-prayer-mat-sets', 'Couple Prayer Mat Sets', NULL, 0),
	('2012e505-1f30-4ba2-aac6-66e24a413262', 'quran-covers', 'Quran Covers', NULL, 0),
	('58042ef3-1fe5-4ce1-b2e0-ba25e65c41d0', 'personalized-quran-covers', 'Personalized Quran Covers', NULL, 0),
	('fddac61f-47e0-49e7-b065-8e26a969f486', 'kids-prayer-mats', 'Kids Prayer Mats', NULL, 0),
	('194091a8-d3a6-4768-b160-f12de14dd13a', 'bridal-islamic-gift-sets', 'Bridal Islamic Gift Sets', NULL, 0),
	('e603437d-39c3-4e6a-b78c-35b19f3d8040', 'islamic-gift-sets', 'Islamic Gift Sets', NULL, 0),
	('bd4aded9-7ef9-42d3-add1-3e8eef4118c3', 'bedding-bath-linen', 'BATH LINEN', NULL, 0),
	('fb7a3517-9cbd-4696-be8a-3df13ab6b217', 'bath-towels', 'Bath Towels', NULL, 0),
	('9157d9f3-7058-4347-8ac7-6df1a275ea65', 'bathrobes', 'Bathrobes', NULL, 0),
	('3b456bc2-34f0-4816-b8ce-6e9a426aa12f', 'bath-mats', 'Bath Mats', NULL, 0),
	('a0c60f41-b198-4ac7-a58e-facece91a54b', 'laundry-bags', 'Laundry Bags', NULL, 0),
	('3bb4e507-13d3-4559-a8eb-637ea1030ca8', 'canvas-and-wall-art', 'CANVAS & WALL ART', NULL, 0),
	('38bf8e57-649b-42bf-9e45-ca19d59e7838', 'wooden-wall-art', 'WOODEN WALL ART', NULL, 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'islamic-wall-art', 'Islamic Wall Art', NULL, 0),
	('c37079d4-6323-4c7a-9b6c-1c09e65fa49c', 'modern-wall-art', 'Modern Wall Art', NULL, 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', 'wall-clocks', 'Wall Clocks', NULL, 0),
	('82b774d0-8624-4159-b33e-850f98d2c3f2', 'business-signs-logos', 'Business Signs & Logos', NULL, 0),
	('3c0cbb20-1a32-467a-a997-49dfa979d4cb', 'kids-decorative-wall-art', 'Kids & Decorative Wall Art', NULL, 0),
	('214845e1-443a-4032-ad0a-3d5c4687bec9', 'tea-coaster', 'Tea Coaster', NULL, 0),
	('8c8a675f-44e6-468a-bde8-aa765d045e2b', 'quotes-wall-art', 'Quotes Wall Art', NULL, 0),
	('7affbe1d-ef41-4a8a-b85e-562c71d72df8', 'couple-wall-art', 'Couple Wall Art', NULL, 0),
	('8f9cad1b-3807-41f3-b5b0-b2f169d6069e', 'acrylic-wall-art', 'ACRYLIC WALL ART', NULL, 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', 'premium-islamic-decor', 'Premium Islamic Decor', NULL, 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', 'acrylic-wall-art-decor', 'Acrylic Wall Art Decor', NULL, 0),
	('cbefba51-2ddc-4373-9de3-89d0163b9f02', 'acrylic-wall-clocks', 'Acrylic Wall Clocks', NULL, 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'mirror-wall-art', 'Mirror Wall Art', NULL, 0),
	('921e09e0-7a8d-49f2-b265-7638deb615a0', 'modern-house-name-plates', 'Modern House Name Plates', NULL, 0),
	('25b1ff27-a5ce-475c-948b-b2194f73018a', 'wall-art-custom', 'CUSTOM & PERSONALIZED', NULL, 0),
	('9334014c-cbf7-4fe1-8c2c-22b6ed0806bc', 'personalized-name-plates', 'Personalized Name Plates', NULL, 0),
	('d84bdc96-6527-4bb1-a10c-b177917ddef5', 'kids-name-signs', 'Kids Name Signs', NULL, 0),
	('d3238979-675c-4afa-8a5c-6c95c785a05f', 'custom-business-signs', 'Business Signs & Logos', NULL, 0),
	('e2681cbc-2fd2-4717-923c-1ed9f72db550', 'custom-wall-art', 'Custom Wall Art', NULL, 0),
	('574890ce-c88d-4502-9214-671181e540bd', 'custom-design-orders', 'Custom Design Orders', NULL, 0),
	('ee41995f-207f-4bb3-a829-9b5fc2891f7a', 'canvas-wall-art', 'CANVAS WALL ART', NULL, 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', 'islamic-canvas-art', 'Islamic Canvas Art', NULL, 0),
	('dfd382ee-051a-46d4-bdaf-b783e5771bff', 'abstract-canvas-art', 'Abstract Canvas Art', NULL, 0),
	('e9e1bd9c-04f3-418e-ac34-d0c14d026f2c', 'signature-canvas-art', 'Signature Canvas Art', NULL, 0),
	('6f153d51-0cf6-4ae6-abf6-37bfc9e8a63c', 'nature-landscape-art', 'Nature & Landscape Art', NULL, 0),
	('02e8e356-ea4e-44b9-90ad-bdec405cf7d3', 'floral-canvas-art', 'Floral Canvas Art', NULL, 0),
	('31d32d18-7a61-444d-85ae-b7f8ffc96a72', 'modern-canvas-art', 'Modern Canvas Art', NULL, 0),
	('cb53d096-4613-4533-b641-e16a6ed26ab7', 'motivational-quote-art', 'Motivational Quote Art', NULL, 0),
	('6b35b7fd-5fba-463f-8397-c0795b384a39', 'kids-canvas-art', 'Kids Canvas Art', NULL, 0),
	('79fcbb6c-a405-4768-94ba-107372bc73b1', 'legends-personalities-art', 'Legends & Personalities Art', NULL, 0),
	('4b276a96-7590-483b-872f-6dcd9a32fd4b', 'laser-cutwork-frame', 'Laser Cutwork Frame', NULL, 0),
	('bb082c20-2e2e-4ca8-9d96-297b55313b81', 'canvas-custom', 'CUSTOM & PERSONALIZED', NULL, 0),
	('96d59813-f20c-4dc5-847e-dce909de06e1', 'custom-photo-canvas', 'Custom Photo Canvas', NULL, 0),
	('2ced606e-3bd5-4387-98ae-b98d3684fd38', 'hand-painted-canvas-art', 'Hand-Painted Canvas Art', NULL, 0),
	('11f89074-e32e-4c28-83c5-bbcdd12589bb', 'curtains-and-blinds', 'CURTAINS & BLINDS', NULL, 0),
	('e34e68f5-538f-49cb-be57-26af1b1785d1', 'curtains-by-fabric', 'CURTAINS BY FABRIC', NULL, 0),
	('18981685-aa6e-4068-b68c-1ed6df9e7a0b', 'velvet-curtains', 'Velvet Curtains', NULL, 0),
	('aa939bfb-393f-4bd7-88fd-222fc5605045', 'sheer-net-curtains', 'Sheer / Net Curtains', NULL, 0),
	('1dac2576-b612-486f-82ca-2d2526791910', 'silk-curtains', 'Silk Curtains', NULL, 0),
	('c631a224-cf07-48aa-b471-763acbe608b2', 'jute-curtains', 'Jute Curtains', NULL, 0),
	('3f9d484b-2854-4a24-b933-cb800ad43134', 'curtains-by-design', 'CURTAINS BY DESIGN', NULL, 0),
	('1ab9cda5-e330-485f-b459-7cb2b9de6ca4', 'digitally-printed-curtains', 'Digitally Printed Curtains', NULL, 0),
	('051f5f2a-897b-417d-abcc-5d99f1511a10', 'gradient-double-shade-curtains', 'Gradient & Double-Shade Curtains', NULL, 0),
	('ff9bdb6e-7477-46ab-bc46-4568de3d8f76', 'laser-cut-velvet-curtains', 'Laser-Cut Velvet Curtains', NULL, 0),
	('04afa32d-586e-44a0-90a5-1043b5821482', 'kids-printed-curtains', 'Kids Printed Curtains', NULL, 0),
	('f52bf2f6-def8-443d-8cbf-16e725b18d53', 'curtain-rods-pipes', 'Curtain Rods & Pipes', NULL, 0),
	('274c0305-e7b7-44cc-a762-a9305b9157d6', 'ceiling-tracks-railing', 'Ceiling Tracks & Railings', NULL, 0),
	('8ede90d9-7604-4e4b-8fc2-9c92b1084f7f', 'end-caps-finials', 'End Caps & Finials', NULL, 0),
	('b073f43c-048e-4879-a78a-d8706c0ef204', 'tassels-trimmings', 'Tassels & Trimmings', NULL, 0),
	('4da9d96e-189f-47dd-a1bd-2466e517c8e4', 'tie-belts-holdbacks', 'Tie Belts & Holdbacks', NULL, 0),
	('15470ef9-434f-42f4-bfad-20398ac96d8d', 'blinds-track-systems', 'BLINDS & TRACK SYSTEMS', NULL, 0),
	('cc512615-e372-45b6-ab9e-862b403a6351', 'curtains-special-collections', 'SPECIAL COLLECTIONS', NULL, 0),
	('8926cfba-c299-4398-aebe-466c00ea526a', 'custom-made-curtains', 'Custom-Made Curtains', NULL, 0),
	('3d69aeb1-d249-4598-bf40-da60d974ca79', 'kids-curtains', 'Kids’ Curtains', NULL, 0),
	('0a1730fa-5c6b-4845-a691-537e1d56eb6d', 'luxury-curtain-collection', 'Luxury Curtain Collection', NULL, 0),
	('046e020c-8861-4db8-bfaa-838e85af1120', 'curtain-installation-service', 'Curtain Installation Service', NULL, 0),
	('9f0e82cc-08cb-46ab-b4e6-17ce688961cd', 'curtains-shop-services', 'SHOP & SERVICES', NULL, 0),
	('d10736cc-6e3b-4609-aa73-6d549913bb4d', 'curtain-new-arrivals', 'New Arrivals', NULL, 0),
	('b18b607d-8e51-40d1-b4f6-e308d51c52ef', 'curtain-best-sellers', 'Best Sellers', NULL, 0),
	('e20379e1-2d23-4ad3-a7dc-31587fe17705', 'custom-curtain-orders', 'Custom Curtain Orders', NULL, 0),
	('e304875f-0265-4aaf-8090-6dbd7c72af95', 'sale', 'SALE', NULL, 0);


--
-- Data for Name: category_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category_products" ("category_id", "product_id", "sort_order") VALUES
	('b7250787-b307-4a94-8f51-039b276145ca', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'a3b905ae-c332-435c-aa83-c8ce93593281', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'e0016288-fa07-42ce-be3c-d712d1833301', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', '173aabab-f539-440c-a451-16e9ccba6f64', 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', '668de9a1-e76c-487e-82ed-935b5e13c22e', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '73b9e4d5-a375-4653-bd5a-485a423fd912', 0),
	('9fdcfa9d-deb2-412a-8005-a516a6e8dcce', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', '3f85931f-ea9b-480c-b6c2-3411e575c185', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', '546758f9-a2a8-41f3-b628-506123efb59e', 0),
	('fd316e6d-51e2-4120-92ca-585cfd7748f9', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 0),
	('14476d14-f424-4474-8ec2-b542886e21d6', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 0),
	('921e09e0-7a8d-49f2-b265-7638deb615a0', 'e0380f4a-1830-40d9-a642-61962dc99f84', 0),
	('4b276a96-7590-483b-872f-6dcd9a32fd4b', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 0),
	('8c8a675f-44e6-468a-bde8-aa765d045e2b', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 0),
	('7affbe1d-ef41-4a8a-b85e-562c71d72df8', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '356dbafa-3027-4daf-8888-59d8de2957c0', 0),
	('cbefba51-2ddc-4373-9de3-89d0163b9f02', '65b72e18-cab5-4c72-aaac-747e9093267e', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '1fd1e82f-4864-4473-a64c-9ca433878873', 0),
	('cbefba51-2ddc-4373-9de3-89d0163b9f02', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 0),
	('cbefba51-2ddc-4373-9de3-89d0163b9f02', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 0),
	('6f153d51-0cf6-4ae6-abf6-37bfc9e8a63c', '09b07e4a-209b-41e0-9343-a4650c533772', 0),
	('6b35b7fd-5fba-463f-8397-c0795b384a39', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'd5c4195a-6841-46ca-83af-b4df011d7984', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'acc68cea-54b8-4248-a20d-291930c71f2a', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'ddc38436-5ef4-4877-a360-4f05211911c7', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 0),
	('0751f947-e874-45fe-9ad5-5019df396c34', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 0),
	('b560137a-d14d-4afa-a9d3-3b6c5e052fb1', 'aedebcae-88ec-49a1-9727-968e07c54a3d', 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', '945ee356-4a88-45cc-ab3e-953158a5f89f', 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', '3810cd1c-785e-45b0-9156-b4c02e26015d', 0),
	('635acc90-0077-48f3-9f99-4eebc49f5131', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'e602e9f1-8356-4943-8bbc-5dd731063740', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '0b774948-d62b-49f2-8658-62c86afd399e', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'b6f69257-b04c-404f-8067-2f18564b17cb', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '9bd5d093-51a0-4111-a0e9-a128790823a8', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '1dd08759-a527-4ce2-873b-91e0736787b9', 0),
	('b7250787-b307-4a94-8f51-039b276145ca', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', 'd324d689-8609-485c-873c-be8a56440940', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '42559937-d01a-4be6-b959-194d69bcdf97', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '00024bd1-77ca-46c3-9748-b7b8218f2230', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 0),
	('f9b2c2e6-066a-45bd-9d24-610e5eaa356d', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', '8d2b0369-597e-42ab-b830-678091e8afb7', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 0),
	('c7b34c8c-913d-4f66-a33d-a2b8e7315df3', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 0),
	('c17a5066-d5de-44dc-a53f-59c2a8321568', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 0),
	('c17a5066-d5de-44dc-a53f-59c2a8321568', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 0),
	('c17a5066-d5de-44dc-a53f-59c2a8321568', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 0),
	('f72e3763-68e4-4ec2-9228-d701d84a3ac7', '17124218-20c5-4358-be39-690fc31db672', 0),
	('f72e3763-68e4-4ec2-9228-d701d84a3ac7', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', 0);


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."collections" ("id", "slug", "name", "description", "status") VALUES
	('a37ea9bb-9f2a-4c3c-a02a-e457850f7ba0', 'new-in', 'NEW IN', 'Shop NEW IN at Dec Walls.', 'published'),
	('a3343d81-b812-4317-91dd-eb9349680f5a', 'bedding', 'BEDDING', 'Shop BEDDING at Dec Walls.', 'published'),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'home-decor', 'HOME DECOR', 'Shop HOME DECOR at Dec Walls.', 'published'),
	('542b794a-f458-43b0-bcad-86b263afcad1', 'baby-and-nursery', 'BABY & NURSERY', 'Shop BABY & NURSERY at Dec Walls.', 'published'),
	('16eed097-f816-4f36-8629-088c508fec2a', 'canvas-and-wall-art', 'CANVAS & WALL ART', 'Shop CANVAS & WALL ART at Dec Walls.', 'published'),
	('bf9728be-3db0-49f7-923e-3375afe44d84', 'curtains-and-blinds', 'CURTAINS & BLINDS', 'Shop CURTAINS & BLINDS at Dec Walls.', 'published'),
	('7081cb99-5191-4b26-8ea6-410da2effd11', 'home-decor-luxury', 'LUXURY HOME DECOR', 'Shop LUXURY HOME DECOR at Dec Walls.', 'published'),
	('dd90dc72-c867-4a18-b791-1ed583bad939', 'decorative-showpieces', 'Decorative Showpieces', 'Shop Decorative Showpieces at Dec Walls.', 'published'),
	('44374b56-c8ba-4f7b-b477-15b218216453', 'table-decor', 'Table Decor', 'Shop Table Decor at Dec Walls.', 'published'),
	('b104847d-b78c-46e6-b0d5-cb7a2a40120d', 'planters', 'Planters', 'Shop Planters at Dec Walls.', 'published'),
	('d78a8161-2d19-48f0-ae12-0b7a06360a1c', 'cushion-covers', 'Cushion Covers', 'Shop Cushion Covers at Dec Walls.', 'published'),
	('5375ceeb-2bac-4671-b3b4-8ef72ceb521a', 'accessories', 'Accessories', 'Shop Accessories at Dec Walls.', 'published'),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', 'led-lamps', 'LED Lamps', 'Shop LED Lamps at Dec Walls.', 'published'),
	('2f0cb81d-24eb-43f5-a551-90be237ef99c', 'shelves', 'Shelves & Storage', 'Shop Shelves & Storage at Dec Walls.', 'published'),
	('1b9bfe55-f5aa-4896-bc81-2fdb8507f260', 'decorative-frames', 'Decorative Frames', 'Shop Decorative Frames at Dec Walls.', 'published'),
	('2c6a7134-1c5e-4596-b1a3-1451b900528e', 'home-decor-curtains', 'CURTAINS AND BLINDS', 'Shop CURTAINS AND BLINDS at Dec Walls.', 'published'),
	('beaf17d8-8638-4b36-8be0-fcf470c4cc8f', 'luxury-velvet-curtains', 'Luxury Velvet Curtains', 'Shop Luxury Velvet Curtains at Dec Walls.', 'published'),
	('0f51132d-aa35-4daa-9b9b-6062886dbbdb', 'jacquard-curtains', 'Jacquard Curtains', 'Shop Jacquard Curtains at Dec Walls.', 'published'),
	('6908a963-3878-416e-a216-915ec79eacb2', 'premium-curtains', 'Premium Curtains', 'Shop Premium Curtains at Dec Walls.', 'published'),
	('f0afcf59-cf09-4dc4-85a7-9d40abaa26e7', 'gradient-double-shaded-curtains', 'Gradient Double Shaded', 'Shop Gradient Double Shaded at Dec Walls.', 'published'),
	('cafbd111-9c34-4053-a344-4707b047b223', 'laser-cutwork-curtains', 'Laser Cutwork', 'Shop Laser Cutwork at Dec Walls.', 'published'),
	('b3cab54f-2702-4fdb-9b98-d68e87c1bb54', 'curtain-accessories', 'Accessories & Railings', 'Shop Accessories & Railings at Dec Walls.', 'published'),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'home-decor-furniture', 'FURNITURE', 'Shop FURNITURE at Dec Walls.', 'published'),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'tables-consoles', 'Tables & Consoles', 'Shop Tables & Consoles at Dec Walls.', 'published'),
	('51a70a4a-a9ff-4899-ae68-de769be3b128', 'ottoman-stools', 'Ottoman Stools', 'Shop Ottoman Stools at Dec Walls.', 'published'),
	('dd6ac7ed-9a5e-4e11-aed1-9d7d43df9d35', 'serving-trolleys', 'Serving Trolleys', 'Shop Serving Trolleys at Dec Walls.', 'published'),
	('d6711df9-d939-40c8-99f6-70ae7a1d0689', 'home-decor-blinds', 'PREMIUM BLINDS', 'Shop PREMIUM BLINDS at Dec Walls.', 'published'),
	('320a4acb-7782-4d35-accb-65a718b100f5', 'premium-blinds', 'Premium Blinds', 'Shop Premium Blinds at Dec Walls.', 'published'),
	('9149b3e9-6dc6-4066-bcf5-93c670944054', 'roller-blinds', 'Roller Blinds', 'Shop Roller Blinds at Dec Walls.', 'published'),
	('6b908532-bf78-4524-a621-e51446ae2de6', 'roman-blinds', 'Roman Blinds', 'Shop Roman Blinds at Dec Walls.', 'published'),
	('2c44dc4c-b40f-4eec-b4e2-0537f57e7300', 'zebra-blinds', 'Zebra Blinds', 'Shop Zebra Blinds at Dec Walls.', 'published'),
	('b1a671fc-c665-42cd-9e5c-6138be68d0b5', 'baby-sleep-comfort', 'SLEEP & COMFORT', 'Shop SLEEP & COMFORT at Dec Walls.', 'published'),
	('99d0850b-72cc-4355-a492-45c43315150b', 'baby-bassinets', 'Baby Bassinets', 'Shop Baby Bassinets at Dec Walls.', 'published'),
	('1b5d5914-a795-46ff-9f54-107232ac3c89', 'carry-nests', 'Carry Nests', 'Shop Carry Nests at Dec Walls.', 'published'),
	('108ec469-4022-43d2-b428-b6471e679dd7', 'baby-cot-sets', 'Baby Cot Sets', 'Shop Baby Cot Sets at Dec Walls.', 'published'),
	('c1d2d99e-6c34-4f20-ac0d-0cb004e95f9b', 'snuggle-beds', 'Snuggle Beds', 'Shop Snuggle Beds at Dec Walls.', 'published'),
	('0b054c55-bbf0-483b-95c5-dba5a09c009f', 'baby-comforter-sets', 'Baby Comforter Sets', 'Shop Baby Comforter Sets at Dec Walls.', 'published'),
	('e6744b65-e52e-4045-b648-aaaaa9e34ad0', 'baby-nursery-essentials', 'NURSERY ESSENTIALS', 'Shop NURSERY ESSENTIALS at Dec Walls.', 'published'),
	('ae7723d5-b53a-450e-b8ec-8fa4b84ab495', 'kids-nursery-sets', 'Kids Nursery Sets', 'Shop Kids Nursery Sets at Dec Walls.', 'published'),
	('785df2f4-84b9-42b5-8a04-da50983af2c6', 'baby-support-seats', 'Baby Support Seats', 'Shop Baby Support Seats at Dec Walls.', 'published'),
	('36b7f10c-9953-47fd-a739-712672ddfb5d', 'storage-baskets', 'Storage Baskets', 'Shop Storage Baskets at Dec Walls.', 'published'),
	('f7b0154e-5d77-4a5e-9839-3bdab1d5664a', 'cot-accessories', 'Cot Accessories', 'Shop Cot Accessories at Dec Walls.', 'published'),
	('d5676f91-4c78-4707-b4e3-228d72fda9b5', 'nursery-bedding', 'Nursery Bedding', 'Shop Nursery Bedding at Dec Walls.', 'published'),
	('5e1e6766-9546-4df7-8710-63d8790f5320', 'kids-learning-tools', 'Kids Learning Tools', 'Shop Kids Learning Tools at Dec Walls.', 'published'),
	('4645890d-ab80-46d8-a73c-efca7c0a1d0b', 'baby-shop-services', 'SHOP & SERVICES', 'Shop SHOP & SERVICES at Dec Walls.', 'published'),
	('95498379-5625-43e9-beca-8de675653ee6', 'new-arrivals', 'New Arrivals', 'Shop New Arrivals at Dec Walls.', 'published'),
	('10054c32-24d6-427d-97ee-c834f3c292d7', 'best-sellers', 'Best Sellers', 'Shop Best Sellers at Dec Walls.', 'published'),
	('c41e8735-ae19-44b7-953c-7233492e3b69', 'custom-made-sets', 'Custom-Made Sets', 'Shop Custom-Made Sets at Dec Walls.', 'published'),
	('8d32a06d-9531-47bf-9ecf-91432817c606', 'wholesale-enquiries', 'Wholesale Enquiries', 'Shop Wholesale Enquiries at Dec Walls.', 'published'),
	('c4e45b10-7fe9-4a54-a4be-bbb52c75dd9a', 'bedding-bed-linen', 'BED LINEN', 'Shop BED LINEN at Dec Walls.', 'published'),
	('a86be2a4-99a4-4fe9-965e-c783f949a5e3', 'bedsheets', 'Bedsheets', 'Shop Bedsheets at Dec Walls.', 'published'),
	('3355f73a-dd99-4cb2-81d3-9012a357ca51', 'velvet-bedsheets', 'Velvet Bedsheets', 'Shop Velvet Bedsheets at Dec Walls.', 'published'),
	('efc88a2c-91f6-4daa-bec3-8188db40391d', 'designer-bedsheets', 'Designer Bedsheets', 'Shop Designer Bedsheets at Dec Walls.', 'published'),
	('b44141d1-75b1-4ff1-8f96-fff5c27833d9', 'pillow-covers', 'Pillow Covers', 'Shop Pillow Covers at Dec Walls.', 'published'),
	('f25adbed-c926-4f6e-a53c-1f7840f192b9', 'bed-runners', 'Bed Runners', 'Shop Bed Runners at Dec Walls.', 'published'),
	('afb6e9aa-c0ab-4fb8-89b5-1aef1036963d', 'bedspreads', 'Bedspreads', 'Shop Bedspreads at Dec Walls.', 'published'),
	('3ceb283e-38de-4400-a781-eac5edb87b4b', 'bedding-essentials', 'BEDDING ESSENTIALS', 'Shop BEDDING ESSENTIALS at Dec Walls.', 'published'),
	('5784b428-8d2f-49a1-9e84-c56336d45111', 'mattress-protectors', 'Mattress Protectors', 'Shop Mattress Protectors at Dec Walls.', 'published'),
	('cf66b55b-21d7-4c6f-84da-28fe75212485', 'mattress-toppers', 'Mattress Toppers', 'Shop Mattress Toppers at Dec Walls.', 'published'),
	('5eb01c6a-870f-452c-ae06-2d877dcee6af', 'bedding-cushion-fillings', 'Bedding & Cushion Fillings', 'Shop Bedding & Cushion Fillings at Dec Walls.', 'published'),
	('b1bd4362-aec9-4cc3-a6cd-e636e892ad2f', 'blankets-throws', 'Blankets & Throws', 'Shop Blankets & Throws at Dec Walls.', 'published'),
	('a2011d5e-8dd9-4489-a33e-6465240e0def', 'bedding-comfort-luxury', 'COMFORT & LUXURY', 'Shop COMFORT & LUXURY at Dec Walls.', 'published'),
	('9e7033b9-9191-4221-a69e-5d4e10d11365', 'luxury-bridal-bedding', 'Luxury Bridal Bedding', 'Shop Luxury Bridal Bedding at Dec Walls.', 'published'),
	('c0b3a9cc-ae94-4e6f-98b0-76e8f1bdfdf7', 'comforter-sets', 'Comforter Sets', 'Shop Comforter Sets at Dec Walls.', 'published'),
	('a0c9cdbf-2ed2-48bb-80c3-143556bf3edc', 'duvet-sets', 'Duvet Sets', 'Shop Duvet Sets at Dec Walls.', 'published'),
	('4b238db1-bfbb-46ce-9586-82d4f39138ff', 'quilts', 'Quilts', 'Shop Quilts at Dec Walls.', 'published'),
	('8124f3d9-af68-48d3-8871-4b3b1fea8431', 'custom-made-bedding', 'Custom-Made Bedding', 'Shop Custom-Made Bedding at Dec Walls.', 'published'),
	('6b0996ae-76ce-4549-a779-3458bde7fb93', 'bedding-kitchen-linen', 'KITCHEN LINEN', 'Shop KITCHEN LINEN at Dec Walls.', 'published'),
	('c63a921b-bc1a-4152-b2fb-4ad2fbb1f325', 'table-runners', 'Table Runners', 'Shop Table Runners at Dec Walls.', 'published'),
	('86c0000a-aae1-4d92-b2ca-759101fcd8a8', 'table-mats', 'Table Mats', 'Shop Table Mats at Dec Walls.', 'published'),
	('62a08644-01ab-46c1-93c2-954955d28610', 'table-covers', 'Table Covers', 'Shop Table Covers at Dec Walls.', 'published'),
	('cbf2a341-ea48-4c66-8baf-66764fbbb4ec', 'cloth-napkins', 'Cloth Napkins', 'Shop Cloth Napkins at Dec Walls.', 'published'),
	('9fc81372-6765-46fb-ba8a-b181d3872728', 'kitchen-aprons', 'Kitchen Aprons', 'Shop Kitchen Aprons at Dec Walls.', 'published'),
	('2197b70a-2fa7-4f0f-a7c3-ac0993e64fec', 'bedding-islamic-essentials', 'ISLAMIC ESSENTIALS', 'Shop ISLAMIC ESSENTIALS at Dec Walls.', 'published'),
	('47a89381-d72b-4b75-8436-97459dabe640', 'prayer-mats', 'Prayer Mats', 'Shop Prayer Mats at Dec Walls.', 'published'),
	('c45f4c31-9904-4296-a14e-9966859358f4', 'personalized-prayer-mats', 'Personalized Prayer Mats', 'Shop Personalized Prayer Mats at Dec Walls.', 'published'),
	('6b707ccb-62c1-4d72-b8a0-1ae648429862', 'couple-prayer-mat-sets', 'Couple Prayer Mat Sets', 'Shop Couple Prayer Mat Sets at Dec Walls.', 'published'),
	('f93ed603-5824-4681-b6de-400ad6a22cd7', 'quran-covers', 'Quran Covers', 'Shop Quran Covers at Dec Walls.', 'published'),
	('d3e00517-2025-449a-a2c3-5bcda8f9c35d', 'personalized-quran-covers', 'Personalized Quran Covers', 'Shop Personalized Quran Covers at Dec Walls.', 'published'),
	('982a8a5c-f251-44b2-be2c-7ffd70c768eb', 'kids-prayer-mats', 'Kids Prayer Mats', 'Shop Kids Prayer Mats at Dec Walls.', 'published'),
	('37eb84ad-8b00-4957-9dc8-6e3cee892c4d', 'bridal-islamic-gift-sets', 'Bridal Islamic Gift Sets', 'Shop Bridal Islamic Gift Sets at Dec Walls.', 'published'),
	('d35aac32-48ad-4f1e-afd0-fd045d861c1d', 'islamic-gift-sets', 'Islamic Gift Sets', 'Shop Islamic Gift Sets at Dec Walls.', 'published'),
	('a9bc38b1-3e56-4efe-9c9c-191879ed05df', 'bedding-bath-linen', 'BATH LINEN', 'Shop BATH LINEN at Dec Walls.', 'published'),
	('8db186bc-a1a5-4298-a4a4-076379e832a5', 'bath-towels', 'Bath Towels', 'Shop Bath Towels at Dec Walls.', 'published'),
	('9cd0e003-9422-4641-b7ef-d2517c0065ff', 'bathrobes', 'Bathrobes', 'Shop Bathrobes at Dec Walls.', 'published'),
	('fa7dce24-876c-46ca-8cab-45e3baa971d2', 'bath-mats', 'Bath Mats', 'Shop Bath Mats at Dec Walls.', 'published'),
	('87cb197a-7552-4a46-9e4e-4ad873809e16', 'laundry-bags', 'Laundry Bags', 'Shop Laundry Bags at Dec Walls.', 'published'),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'wooden-wall-art', 'WOODEN WALL ART', 'Shop WOODEN WALL ART at Dec Walls.', 'published'),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'islamic-wall-art', 'Islamic Wall Art', 'Shop Islamic Wall Art at Dec Walls.', 'published'),
	('fdb2bc0f-4ca7-4b4e-8e5e-b26a85974844', 'modern-wall-art', 'Modern Wall Art', 'Shop Modern Wall Art at Dec Walls.', 'published'),
	('afd29234-5165-4bb7-9d40-d14b596de543', 'wall-clocks', 'Wall Clocks', 'Shop Wall Clocks at Dec Walls.', 'published'),
	('ee6dcd89-4c6f-46d7-b0a5-efa3402310bd', 'business-signs-logos', 'Business Signs & Logos', 'Shop Business Signs & Logos at Dec Walls.', 'published'),
	('2bab0c19-be7d-4759-94a2-f49c510edaf9', 'kids-decorative-wall-art', 'Kids & Decorative Wall Art', 'Shop Kids & Decorative Wall Art at Dec Walls.', 'published'),
	('3b98900a-f84c-4bd7-a174-d169dfc465f4', 'tea-coaster', 'Tea Coaster', 'Shop Tea Coaster at Dec Walls.', 'published'),
	('a3139de6-0486-4105-ae7f-28a71078f1f0', 'quotes-wall-art', 'Quotes Wall Art', 'Shop Quotes Wall Art at Dec Walls.', 'published'),
	('1eed81e3-3219-48f0-9f6b-16d40154d215', 'couple-wall-art', 'Couple Wall Art', 'Shop Couple Wall Art at Dec Walls.', 'published'),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'acrylic-wall-art', 'ACRYLIC WALL ART', 'Shop ACRYLIC WALL ART at Dec Walls.', 'published'),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', 'premium-islamic-decor', 'Premium Islamic Decor', 'Shop Premium Islamic Decor at Dec Walls.', 'published'),
	('a2c51965-aa26-41e5-9570-0210c141b353', 'acrylic-wall-art-decor', 'Acrylic Wall Art Decor', 'Shop Acrylic Wall Art Decor at Dec Walls.', 'published'),
	('192f3a6f-3e03-4d16-bbd3-256612fcc121', 'acrylic-wall-clocks', 'Acrylic Wall Clocks', 'Shop Acrylic Wall Clocks at Dec Walls.', 'published'),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'mirror-wall-art', 'Mirror Wall Art', 'Shop Mirror Wall Art at Dec Walls.', 'published'),
	('a4412f03-bb39-42f9-814d-6428cf8aabab', 'modern-house-name-plates', 'Modern House Name Plates', 'Shop Modern House Name Plates at Dec Walls.', 'published'),
	('971f4f5c-fadd-4e8f-a127-0a6a5dcc5c46', 'wall-art-custom', 'CUSTOM & PERSONALIZED', 'Shop CUSTOM & PERSONALIZED at Dec Walls.', 'published'),
	('b95e8b4a-5587-41dd-ac56-88622472905b', 'personalized-name-plates', 'Personalized Name Plates', 'Shop Personalized Name Plates at Dec Walls.', 'published'),
	('da2cf3fc-2a15-4119-bc10-74dab94bbd39', 'kids-name-signs', 'Kids Name Signs', 'Shop Kids Name Signs at Dec Walls.', 'published'),
	('7e0fc004-a394-4fdb-aea6-21b624b9b5c0', 'custom-business-signs', 'Business Signs & Logos', 'Shop Business Signs & Logos at Dec Walls.', 'published'),
	('d0f1924a-4990-442a-a444-aa320d64d9d7', 'custom-wall-art', 'Custom Wall Art', 'Shop Custom Wall Art at Dec Walls.', 'published'),
	('49d915d4-7293-4561-b378-6a50107e2b85', 'custom-design-orders', 'Custom Design Orders', 'Shop Custom Design Orders at Dec Walls.', 'published'),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'canvas-wall-art', 'CANVAS WALL ART', 'Shop CANVAS WALL ART at Dec Walls.', 'published'),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', 'islamic-canvas-art', 'Islamic Canvas Art', 'Shop Islamic Canvas Art at Dec Walls.', 'published'),
	('96a85465-86de-4ed7-ac08-a53f61786e46', 'abstract-canvas-art', 'Abstract Canvas Art', 'Shop Abstract Canvas Art at Dec Walls.', 'published'),
	('76c67f76-a491-4654-9a7e-7f91f688784b', 'signature-canvas-art', 'Signature Canvas Art', 'Shop Signature Canvas Art at Dec Walls.', 'published'),
	('858a86a4-3277-4f10-97b5-a3d19ac166cc', 'nature-landscape-art', 'Nature & Landscape Art', 'Shop Nature & Landscape Art at Dec Walls.', 'published'),
	('e87743e4-c69e-4ebf-a6d7-0a83d14f9c12', 'floral-canvas-art', 'Floral Canvas Art', 'Shop Floral Canvas Art at Dec Walls.', 'published'),
	('e6a4c9ab-d14f-4bd9-9efe-db8c187b6f24', 'modern-canvas-art', 'Modern Canvas Art', 'Shop Modern Canvas Art at Dec Walls.', 'published'),
	('b0fffdd6-b8f3-4da2-ab6b-2315467297ea', 'motivational-quote-art', 'Motivational Quote Art', 'Shop Motivational Quote Art at Dec Walls.', 'published'),
	('231b2d2d-1d44-4086-9383-9d9bffb3fa0a', 'kids-canvas-art', 'Kids Canvas Art', 'Shop Kids Canvas Art at Dec Walls.', 'published'),
	('2932380b-27c3-4e95-a5cf-debd3454541f', 'legends-personalities-art', 'Legends & Personalities Art', 'Shop Legends & Personalities Art at Dec Walls.', 'published'),
	('a6056d79-0ecf-4de7-bc06-2ca75d013a7b', 'laser-cutwork-frame', 'Laser Cutwork Frame', 'Shop Laser Cutwork Frame at Dec Walls.', 'published'),
	('4b422fe5-7d8b-4bbc-b341-3285ddda7e50', 'canvas-custom', 'CUSTOM & PERSONALIZED', 'Shop CUSTOM & PERSONALIZED at Dec Walls.', 'published'),
	('5a8a6641-f9fb-4cc8-82d1-ff9a7d0988db', 'custom-photo-canvas', 'Custom Photo Canvas', 'Shop Custom Photo Canvas at Dec Walls.', 'published'),
	('e15e9120-6e96-402e-ad34-2c9a3266f6f5', 'hand-painted-canvas-art', 'Hand-Painted Canvas Art', 'Shop Hand-Painted Canvas Art at Dec Walls.', 'published'),
	('160a07d9-df95-4683-8982-eb95042ae676', 'curtains-by-fabric', 'CURTAINS BY FABRIC', 'Shop CURTAINS BY FABRIC at Dec Walls.', 'published'),
	('f2962988-4e8f-472c-9f16-aa5593daaab1', 'velvet-curtains', 'Velvet Curtains', 'Shop Velvet Curtains at Dec Walls.', 'published'),
	('4212943c-ea71-4e41-bc43-6b5caf6518b2', 'sheer-net-curtains', 'Sheer / Net Curtains', 'Shop Sheer / Net Curtains at Dec Walls.', 'published'),
	('b735f811-4d16-4926-8f99-4a2fe4be8de2', 'silk-curtains', 'Silk Curtains', 'Shop Silk Curtains at Dec Walls.', 'published'),
	('056af8b9-1a98-44f7-8ecc-01eefe748e82', 'jute-curtains', 'Jute Curtains', 'Shop Jute Curtains at Dec Walls.', 'published'),
	('3f512eec-554c-48e8-b491-c4833c5af592', 'curtains-by-design', 'CURTAINS BY DESIGN', 'Shop CURTAINS BY DESIGN at Dec Walls.', 'published'),
	('286d6bb6-dc43-497d-86d8-35dbb3ae3767', 'digitally-printed-curtains', 'Digitally Printed Curtains', 'Shop Digitally Printed Curtains at Dec Walls.', 'published'),
	('f7220efe-fba4-48f9-8725-81e63255e603', 'gradient-double-shade-curtains', 'Gradient & Double-Shade Curtains', 'Shop Gradient & Double-Shade Curtains at Dec Walls.', 'published'),
	('d491aa88-00a6-47f1-b1fe-684049ab62ca', 'laser-cut-velvet-curtains', 'Laser-Cut Velvet Curtains', 'Shop Laser-Cut Velvet Curtains at Dec Walls.', 'published'),
	('b1289cee-e2c0-4437-b8a5-551ce511686a', 'kids-printed-curtains', 'Kids Printed Curtains', 'Shop Kids Printed Curtains at Dec Walls.', 'published'),
	('58b46e94-0188-4c41-8d6a-e50eaba38f4e', 'curtain-rods-pipes', 'Curtain Rods & Pipes', 'Shop Curtain Rods & Pipes at Dec Walls.', 'published'),
	('36b4fa52-02c6-4e3d-9df1-a3ea632713cc', 'ceiling-tracks-railing', 'Ceiling Tracks & Railings', 'Shop Ceiling Tracks & Railings at Dec Walls.', 'published'),
	('7697d8ab-3c1a-4b99-967b-51b72c0b43b3', 'end-caps-finials', 'End Caps & Finials', 'Shop End Caps & Finials at Dec Walls.', 'published'),
	('7642d5b9-0f42-4003-877c-3f01bc8ce993', 'tassels-trimmings', 'Tassels & Trimmings', 'Shop Tassels & Trimmings at Dec Walls.', 'published'),
	('55ae5a2b-0d1e-4515-a569-0cdd453e930c', 'tie-belts-holdbacks', 'Tie Belts & Holdbacks', 'Shop Tie Belts & Holdbacks at Dec Walls.', 'published'),
	('fef7bda6-a282-4221-954e-fa798f3809c5', 'blinds-track-systems', 'BLINDS & TRACK SYSTEMS', 'Shop BLINDS & TRACK SYSTEMS at Dec Walls.', 'published'),
	('ecefc691-ec87-434d-b022-0a8a4c4e585f', 'curtains-special-collections', 'SPECIAL COLLECTIONS', 'Shop SPECIAL COLLECTIONS at Dec Walls.', 'published'),
	('648c5daa-d278-4705-b3d1-31b1bda43ca2', 'custom-made-curtains', 'Custom-Made Curtains', 'Shop Custom-Made Curtains at Dec Walls.', 'published'),
	('4475a9c4-5695-4470-b838-c1a43f0dfea9', 'kids-curtains', 'Kids’ Curtains', 'Shop Kids’ Curtains at Dec Walls.', 'published'),
	('da67cb32-74a5-4254-851f-460c53899dc4', 'luxury-curtain-collection', 'Luxury Curtain Collection', 'Shop Luxury Curtain Collection at Dec Walls.', 'published'),
	('56c047f8-eb19-4e26-87e8-1addfc06326a', 'curtain-installation-service', 'Curtain Installation Service', 'Shop Curtain Installation Service at Dec Walls.', 'published'),
	('e126580a-8aa4-47c0-9afd-39a276391866', 'curtains-shop-services', 'SHOP & SERVICES', 'Shop SHOP & SERVICES at Dec Walls.', 'published'),
	('6cf72810-2dd1-436b-a532-5f0441960f9b', 'curtain-new-arrivals', 'New Arrivals', 'Shop New Arrivals at Dec Walls.', 'published'),
	('bcd0ab6b-cccd-41bf-8296-e00a91dd3e82', 'curtain-best-sellers', 'Best Sellers', 'Shop Best Sellers at Dec Walls.', 'published'),
	('009239bb-bba3-46ce-930b-211d417a5d2b', 'custom-curtain-orders', 'Custom Curtain Orders', 'Shop Custom Curtain Orders at Dec Walls.', 'published'),
	('573b2c97-ea51-4912-9d9c-b6592108a854', 'sale', 'SALE', 'Shop SALE at Dec Walls.', 'published'),
	('0a08d95e-0b61-4d95-a698-176046477a5b', 'bath', 'Bath', 'Shop Bath at Dec Walls.', 'published'),
	('e6b70fc9-c66d-487d-b712-bbec4b7d9536', 'dining', 'Dining', 'Shop Dining at Dec Walls.', 'published'),
	('6a58f724-4c8f-446e-b158-4e9e2172cad5', 'living', 'Living', 'Shop Living at Dec Walls.', 'published'),
	('828f0954-71b2-4f77-8ed5-64faca611627', 'coverlets', 'Coverlets', 'Shop Coverlets at Dec Walls.', 'published');


--
-- Data for Name: collection_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."collection_products" ("collection_id", "product_id", "sort_order") VALUES
	('6a58f724-4c8f-446e-b158-4e9e2172cad5', '6da834f1-bb5a-497a-8da0-cd8956d87a1e', 0),
	('a3343d81-b812-4317-91dd-eb9349680f5a', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 0),
	('6a58f724-4c8f-446e-b158-4e9e2172cad5', '01ccdd34-04f4-411e-825c-8fbd5c02e3c3', 0),
	('e6b70fc9-c66d-487d-b712-bbec4b7d9536', '988058e6-35a6-4712-b196-de7a8163df02', 0),
	('0a08d95e-0b61-4d95-a698-176046477a5b', 'f04da3e3-68d8-4e33-b2b0-22f07fd079bb', 0),
	('a3343d81-b812-4317-91dd-eb9349680f5a', 'd7db06e3-41dc-46d6-a274-3cac867609c2', 0),
	('a3343d81-b812-4317-91dd-eb9349680f5a', '15293447-0299-44dc-9a82-89dfe80c2c5c', 0),
	('a3343d81-b812-4317-91dd-eb9349680f5a', '31d3e3cd-5fbf-4e41-83bc-67a32f0aaa5d', 0),
	('a3343d81-b812-4317-91dd-eb9349680f5a', '721474ef-7a33-4cc0-a787-bc0caf786599', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 0),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'a3b905ae-c332-435c-aa83-c8ce93593281', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'a3b905ae-c332-435c-aa83-c8ce93593281', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'a3b905ae-c332-435c-aa83-c8ce93593281', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 0),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e0016288-fa07-42ce-be3c-d712d1833301', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'e0016288-fa07-42ce-be3c-d712d1833301', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'e0016288-fa07-42ce-be3c-d712d1833301', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '173aabab-f539-440c-a451-16e9ccba6f64', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '173aabab-f539-440c-a451-16e9ccba6f64', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', '173aabab-f539-440c-a451-16e9ccba6f64', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 0),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '668de9a1-e76c-487e-82ed-935b5e13c22e', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', '668de9a1-e76c-487e-82ed-935b5e13c22e', 0),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', '668de9a1-e76c-487e-82ed-935b5e13c22e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 0),
	('a2c51965-aa26-41e5-9570-0210c141b353', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 0),
	('a2c51965-aa26-41e5-9570-0210c141b353', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '73b9e4d5-a375-4653-bd5a-485a423fd912', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '73b9e4d5-a375-4653-bd5a-485a423fd912', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '73b9e4d5-a375-4653-bd5a-485a423fd912', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 0),
	('4cbefcc3-2994-4a22-947e-5ede6a95886e', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '3f85931f-ea9b-480c-b6c2-3411e575c185', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '3f85931f-ea9b-480c-b6c2-3411e575c185', 0),
	('a2c51965-aa26-41e5-9570-0210c141b353', '3f85931f-ea9b-480c-b6c2-3411e575c185', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '546758f9-a2a8-41f3-b628-506123efb59e', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '546758f9-a2a8-41f3-b628-506123efb59e', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', '546758f9-a2a8-41f3-b628-506123efb59e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 0),
	('a41be0aa-079e-4339-a20d-1616cd2f371d', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 0),
	('a2c51965-aa26-41e5-9570-0210c141b353', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 0),
	('a2c51965-aa26-41e5-9570-0210c141b353', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e0380f4a-1830-40d9-a642-61962dc99f84', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'e0380f4a-1830-40d9-a642-61962dc99f84', 0),
	('a4412f03-bb39-42f9-814d-6428cf8aabab', 'e0380f4a-1830-40d9-a642-61962dc99f84', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 0),
	('a6056d79-0ecf-4de7-bc06-2ca75d013a7b', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 0),
	('a3139de6-0486-4105-ae7f-28a71078f1f0', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 0),
	('1eed81e3-3219-48f0-9f6b-16d40154d215', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '356dbafa-3027-4daf-8888-59d8de2957c0', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '356dbafa-3027-4daf-8888-59d8de2957c0', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '356dbafa-3027-4daf-8888-59d8de2957c0', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '65b72e18-cab5-4c72-aaac-747e9093267e', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '65b72e18-cab5-4c72-aaac-747e9093267e', 0),
	('192f3a6f-3e03-4d16-bbd3-256612fcc121', '65b72e18-cab5-4c72-aaac-747e9093267e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '1fd1e82f-4864-4473-a64c-9ca433878873', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '1fd1e82f-4864-4473-a64c-9ca433878873', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '1fd1e82f-4864-4473-a64c-9ca433878873', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 0),
	('192f3a6f-3e03-4d16-bbd3-256612fcc121', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 0),
	('192f3a6f-3e03-4d16-bbd3-256612fcc121', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '09b07e4a-209b-41e0-9343-a4650c533772', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', '09b07e4a-209b-41e0-9343-a4650c533772', 0),
	('858a86a4-3277-4f10-97b5-a3d19ac166cc', '09b07e4a-209b-41e0-9343-a4650c533772', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 0),
	('a3fee42f-601b-43b8-a407-cd8bd64b022d', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 0),
	('231b2d2d-1d44-4086-9383-9d9bffb3fa0a', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'd5c4195a-6841-46ca-83af-b4df011d7984', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'd5c4195a-6841-46ca-83af-b4df011d7984', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'd5c4195a-6841-46ca-83af-b4df011d7984', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'acc68cea-54b8-4248-a20d-291930c71f2a', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'acc68cea-54b8-4248-a20d-291930c71f2a', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'acc68cea-54b8-4248-a20d-291930c71f2a', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'ddc38436-5ef4-4877-a360-4f05211911c7', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'ddc38436-5ef4-4877-a360-4f05211911c7', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'ddc38436-5ef4-4877-a360-4f05211911c7', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 0),
	('b427da91-0730-4246-becd-6ac0b1be0ffe', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'aedebcae-88ec-49a1-9727-968e07c54a3d', 0),
	('0ada7947-d4a1-44b6-92a3-cf3e53a70d8f', 'aedebcae-88ec-49a1-9727-968e07c54a3d', 0),
	('dd6ac7ed-9a5e-4e11-aed1-9d7d43df9d35', 'aedebcae-88ec-49a1-9727-968e07c54a3d', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 0),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 0),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '945ee356-4a88-45cc-ab3e-953158a5f89f', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', '945ee356-4a88-45cc-ab3e-953158a5f89f', 0),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', '945ee356-4a88-45cc-ab3e-953158a5f89f', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '3810cd1c-785e-45b0-9156-b4c02e26015d', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', '3810cd1c-785e-45b0-9156-b4c02e26015d', 0),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', '3810cd1c-785e-45b0-9156-b4c02e26015d', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 0),
	('ab94572f-bd4e-4f66-a68e-e0a199000f47', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e602e9f1-8356-4943-8bbc-5dd731063740', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'e602e9f1-8356-4943-8bbc-5dd731063740', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'e602e9f1-8356-4943-8bbc-5dd731063740', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '0b774948-d62b-49f2-8658-62c86afd399e', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '0b774948-d62b-49f2-8658-62c86afd399e', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '0b774948-d62b-49f2-8658-62c86afd399e', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'b6f69257-b04c-404f-8067-2f18564b17cb', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'b6f69257-b04c-404f-8067-2f18564b17cb', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'b6f69257-b04c-404f-8067-2f18564b17cb', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '9bd5d093-51a0-4111-a0e9-a128790823a8', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '9bd5d093-51a0-4111-a0e9-a128790823a8', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '9bd5d093-51a0-4111-a0e9-a128790823a8', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '1dd08759-a527-4ce2-873b-91e0736787b9', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '1dd08759-a527-4ce2-873b-91e0736787b9', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '1dd08759-a527-4ce2-873b-91e0736787b9', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 0),
	('f4a6f53f-d119-47c0-8896-105462ff0612', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'd324d689-8609-485c-873c-be8a56440940', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'd324d689-8609-485c-873c-be8a56440940', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', 'd324d689-8609-485c-873c-be8a56440940', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '42559937-d01a-4be6-b959-194d69bcdf97', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '42559937-d01a-4be6-b959-194d69bcdf97', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '42559937-d01a-4be6-b959-194d69bcdf97', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '00024bd1-77ca-46c3-9748-b7b8218f2230', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '00024bd1-77ca-46c3-9748-b7b8218f2230', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '00024bd1-77ca-46c3-9748-b7b8218f2230', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 0),
	('41198e0b-da6d-4b8c-91cd-69b6d6ef8723', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 0),
	('afd29234-5165-4bb7-9d40-d14b596de543', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', '8d2b0369-597e-42ab-b830-678091e8afb7', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', '8d2b0369-597e-42ab-b830-678091e8afb7', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', '8d2b0369-597e-42ab-b830-678091e8afb7', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 0),
	('16eed097-f816-4f36-8629-088c508fec2a', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 0),
	('73153e2d-fa7c-4bbc-aca5-2748916f51fc', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 0),
	('576b05d4-c1d8-420d-b50f-f488006118db', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 0),
	('dd90dc72-c867-4a18-b791-1ed583bad939', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 0),
	('dd90dc72-c867-4a18-b791-1ed583bad939', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 0),
	('4528b481-0cf9-4c90-b86d-5cfceec6baf4', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 0),
	('7081cb99-5191-4b26-8ea6-410da2effd11', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 0),
	('dd90dc72-c867-4a18-b791-1ed583bad939', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 0),
	('542b794a-f458-43b0-bcad-86b263afcad1', '17124218-20c5-4358-be39-690fc31db672', 0),
	('e6744b65-e52e-4045-b648-aaaaa9e34ad0', '17124218-20c5-4358-be39-690fc31db672', 0),
	('5e1e6766-9546-4df7-8710-63d8790f5320', '17124218-20c5-4358-be39-690fc31db672', 0),
	('542b794a-f458-43b0-bcad-86b263afcad1', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', 0),
	('e6744b65-e52e-4045-b648-aaaaa9e34ad0', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', 0),
	('5e1e6766-9546-4df7-8710-63d8790f5320', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', 0);


--
-- Data for Name: content_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: inventory_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: inventory_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: media_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: navigation_menus; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: navigation_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: page_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_images" ("id", "product_id", "url", "alt", "sort_order", "is_primary", "is_hover") VALUES
	('325320b5-e044-4314-b609-f5466e47c04b', '6da834f1-bb5a-497a-8da0-cd8956d87a1e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692239/dec-walls/bareeze/image-17.jpg', 'Neck Roll', 0, true, false),
	('6fc9b16f-5092-46f6-95d0-9e25b459d061', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692400/dec-walls/external/bareezehome-com/CAPP-169-QF-RP.jpg', 'BED IN A BAG', 0, true, false),
	('553c96e7-9fd8-4a82-99c2-c20f5ee29036', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692401/dec-walls/external/bareezehome-com/CAPP-169-QF-RPcloseup1.jpg', 'BED IN A BAG', 1, false, true),
	('969d93b1-c5ba-4dc9-ab90-08f8843ef779', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692402/dec-walls/external/bareezehome-com/CAPP-169-QF-RPcloseup2.jpg', 'BED IN A BAG', 2, false, false),
	('b21c1737-54cd-442b-9966-8d86a04e0562', '25cd7dc2-eefc-4b99-bb67-2734a0efcb12', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692404/dec-walls/external/bareezehome-com/CAPP-169-QF-RPcloseup3.jpg', 'BED IN A BAG', 3, false, false),
	('84027fcc-b5fd-45b4-9f8c-e2e7e4dc8931', '01ccdd34-04f4-411e-825c-8fbd5c02e3c3', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692249/dec-walls/bareeze/image-18.jpg', 'Quran Cover', 0, true, false),
	('bdd21e7d-7b30-4ca5-8c76-f291c51b9bd0', '01ccdd34-04f4-411e-825c-8fbd5c02e3c3', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692250/dec-walls/bareeze/image-19.jpg', 'Quran Cover', 1, false, true),
	('09d1254c-bcef-44d1-94ac-f950dae89f6f', '988058e6-35a6-4712-b196-de7a8163df02', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692175/dec-walls/bareeze/image-11.jpg', 'Table Linen', 0, true, false),
	('788cd784-28da-4e94-b300-501206aedccd', '988058e6-35a6-4712-b196-de7a8163df02', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692185/dec-walls/bareeze/image-12.jpg', 'Table Linen', 1, false, true),
	('f6ed4fc0-bae3-48b7-a3f3-8a924ca9f652', 'f04da3e3-68d8-4e33-b2b0-22f07fd079bb', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692281/dec-walls/bareeze/image-5.jpg', 'TOWEL SET (04-PCS)', 0, true, false),
	('aac58866-2398-493c-a6b7-776fdfc5a2a6', 'd7db06e3-41dc-46d6-a274-3cac867609c2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692272/dec-walls/bareeze/image-4.jpg', 'Silk Plain Bed Sheet Set', 0, true, false),
	('1380fd85-9a1a-4d19-a931-a1183b19fcad', 'd7db06e3-41dc-46d6-a274-3cac867609c2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692281/dec-walls/bareeze/image-5.jpg', 'Silk Plain Bed Sheet Set', 1, false, true),
	('00f06ac4-e247-4e44-b425-7d88619fdc0b', 'd7db06e3-41dc-46d6-a274-3cac867609c2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692290/dec-walls/bareeze/image-6.jpg', 'Silk Plain Bed Sheet Set', 2, false, false),
	('b1fc058e-3532-4124-b357-0483ccce9e97', '15293447-0299-44dc-9a82-89dfe80c2c5c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692256/dec-walls/bareeze/image-25.jpg', 'Khaise', 0, true, false),
	('b9c44a79-e1e9-40ee-ade0-7eca8e2bbc9c', '15293447-0299-44dc-9a82-89dfe80c2c5c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692257/dec-walls/bareeze/image-26.jpg', 'Khaise', 1, false, true),
	('1631a6c8-b081-4a11-9c54-9f97f0317b35', '15293447-0299-44dc-9a82-89dfe80c2c5c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692258/dec-walls/bareeze/image-27.jpg', 'Khaise', 2, false, false),
	('bbff5b66-2198-41ae-a55f-727826bee52c', '31d3e3cd-5fbf-4e41-83bc-67a32f0aaa5d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692360/dec-walls/home/sale-1.jpg', 'Printed Bedding Set', 0, true, false),
	('c2a81ee9-74a9-41e5-897e-cf784078dd38', '31d3e3cd-5fbf-4e41-83bc-67a32f0aaa5d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692361/dec-walls/home/sale-2.jpg', 'Printed Bedding Set', 1, false, true),
	('1bb3ba70-5fd0-4ca6-af54-02a55d2a0a00', '721474ef-7a33-4cc0-a787-bc0caf786599', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692362/dec-walls/home/sale-3.jpg', 'Coverlet', 0, true, false),
	('4fe79491-59e5-4495-a9bd-c417b362b32d', '721474ef-7a33-4cc0-a787-bc0caf786599', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692363/dec-walls/home/sale-4.jpg', 'Coverlet', 1, false, true),
	('708ebdbf-5122-42de-bbd9-2d0d49a339eb', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692405/dec-walls/external/pyariwalls/99_Names_of_Allah_wall_art.jpg', '99 Names of Allah Calligraphy', 0, true, false),
	('fcb16385-6d8a-4c6e-8942-6b0bfa8392df', 'acba90d4-9ce6-454d-b97b-b72f62de2023', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692406/dec-walls/external/pyariwalls/buy1get2-2.jpg', '99 Names of Allah Calligraphy', 1, false, true),
	('13a27f2d-1ef7-4fbd-a69f-412a632fdead', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692406/dec-walls/external/pyariwalls/buy1get2-2.jpg', 'Bismillah Islamic Wall Plaque', 0, true, false),
	('57484712-ed38-4db4-8166-b0c23c7d99c4', 'fdda8b02-71fd-46c0-8033-46beb2dd6712', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692407/dec-walls/external/pyariwalls/WhatsAppImage2023-05-01at3.22.53PM_2.jpg', 'Bismillah Islamic Wall Plaque', 1, false, true),
	('082fb32e-cc81-4b59-9013-46bc828e0bc0', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692407/dec-walls/external/pyariwalls/WhatsAppImage2023-05-01at3.22.53PM_2.jpg', 'Alhamdulillah Calligraphy Panel', 0, true, false),
	('8d046ae4-a41e-4b57-827d-44cc6174a95a', 'a5a566bc-0c7b-461f-84fd-137bd9c3fcb2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692408/dec-walls/external/pyariwalls/WhatsAppImage2023-05-22at3.41.32PM.jpg', 'Alhamdulillah Calligraphy Panel', 1, false, true),
	('ad2f8e90-fa61-4117-9996-f4852c86d5cf', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692408/dec-walls/external/pyariwalls/WhatsAppImage2023-05-22at3.41.32PM.jpg', 'Ayatul Kursi Wooden Wall Art', 0, true, false),
	('23bad17e-579f-4dfb-a88f-37687720f5ab', 'bc07abcc-dd86-4561-bcfe-db6d8939d8cd', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692409/dec-walls/external/pyariwalls/IMG_0591.jpg', 'Ayatul Kursi Wooden Wall Art', 1, false, true),
	('fa2add66-60f8-40c2-a707-7d477877f591', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692409/dec-walls/external/pyariwalls/IMG_0591.jpg', 'Allah Muhammad Twin Calligraphy Set', 0, true, false),
	('3c73d8b8-fc0f-45b0-90a9-c2ee04a3b04f', 'bba791b7-ab28-4f9c-9b1e-5e1ff2e7d3db', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692410/dec-walls/external/pyariwalls/Islamic_wall_sceneries_set.png', 'Allah Muhammad Twin Calligraphy Set', 1, false, true),
	('32451e49-14b3-4622-941b-2353e384462f', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692410/dec-walls/external/pyariwalls/Islamic_wall_sceneries_set.png', 'Makkah Madinah Scenic Frame Set', 0, true, false),
	('df06d78c-c85b-4b69-b1a9-da4d19f3fffe', 'd83635d5-60ea-49ba-9be9-28cfa1fb09ce', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692411/dec-walls/external/pyariwalls/AcrylicLOH.jpg', 'Makkah Madinah Scenic Frame Set', 1, false, true),
	('97fe23e0-becc-4bb0-a712-d1e51e968063', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692411/dec-walls/external/pyariwalls/AcrylicLOH.jpg', 'Premium Loh-e-Qurani Calligraphy', 0, true, false),
	('d156b18a-83b9-4baa-9809-649e9b90fe69', 'c87b376e-6212-4fe1-b60a-cd9063784f46', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692411/dec-walls/external/pyariwalls/TasbeehEFatima.png', 'Premium Loh-e-Qurani Calligraphy', 1, false, true),
	('71093ca7-a24d-443a-8390-36eee82765db', 'a3b905ae-c332-435c-aa83-c8ce93593281', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692411/dec-walls/external/pyariwalls/TasbeehEFatima.png', 'Tasbeeh-e-Fatima Wall Art', 0, true, false),
	('f97da8eb-5478-478d-ba7b-0ee8eb4f836c', 'a3b905ae-c332-435c-aa83-c8ce93593281', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692413/dec-walls/external/pyariwalls/WhatsAppImage2024-02-26at12.14.41.jpg', 'Tasbeeh-e-Fatima Wall Art', 1, false, true),
	('f911e1dd-0ab4-4e8b-9520-4d67dba4ef59', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692413/dec-walls/external/pyariwalls/WhatsAppImage2024-02-26at12.14.41.jpg', 'Bismillah Alhamdulillah Pair', 0, true, false),
	('688d00f2-bac5-4b5f-b7b5-bb9467db4188', 'cbdae8c8-f4af-4e2a-9119-19825cfb65b3', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692413/dec-walls/external/pyariwalls/WhatsAppImage2024-02-01at20.10.24.jpg', 'Bismillah Alhamdulillah Pair', 1, false, true),
	('2d337671-880d-46dc-b17c-0dab30a31ac2', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692413/dec-walls/external/pyariwalls/WhatsAppImage2024-02-01at20.10.24.jpg', 'Islamic Hexagon Wall Art Set', 0, true, false),
	('2c6a040b-bfcc-4b95-8ebb-e98ab100a037', '1b6fd98c-e8d6-445c-9b16-f494b3830bfd', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692414/dec-walls/external/pyariwalls/Home_Decor.jpg', 'Islamic Hexagon Wall Art Set', 1, false, true),
	('cb7263d6-9ff8-45f9-820c-3f4c3230d34c', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692414/dec-walls/external/pyariwalls/Home_Decor.jpg', 'Modern Islamic Home Decor Panel', 0, true, false),
	('4a0e00ca-ea61-41bd-826c-44e12158a199', 'e55e8505-7250-47e7-8fde-f0ac91d0099b', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692415/dec-walls/external/pyariwalls/WhatsAppImage2024-02-11at00.02.46_1.jpg', 'Modern Islamic Home Decor Panel', 1, false, true),
	('a5160be7-b208-4974-9b40-05b33a62b6ca', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692415/dec-walls/external/pyariwalls/WhatsAppImage2024-02-11at00.02.46_1.jpg', 'Ayatul Kursi Acrylic Wall Decor', 0, true, false),
	('b51395de-e1e5-47df-80ee-465bd0f16870', 'f40cf9c9-6ae1-424c-bc4c-fde94f0db9a4', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692416/dec-walls/external/pyariwalls/ChatGPT_Image_Jan_19_2026_02_47_17_PM_1.png', 'Ayatul Kursi Acrylic Wall Decor', 1, false, true),
	('4fb635ff-a2a7-4ec2-a051-4dd09d504813', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692416/dec-walls/external/pyariwalls/ChatGPT_Image_Jan_19_2026_02_47_17_PM_1.png', 'Contemporary Islamic Calligraphy', 0, true, false),
	('55ac8bb2-5ba6-4715-9963-1023b8e5b8a7', 'f4bb47dc-7deb-4777-8030-ea15cef0a263', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692417/dec-walls/external/pyariwalls/IMG_0994.jpg', 'Contemporary Islamic Calligraphy', 1, false, true),
	('6710ae60-9cb6-4502-8164-fee46f119597', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692417/dec-walls/external/pyariwalls/IMG_0994.jpg', 'Surah Ikhlas Round Wall Plaque', 0, true, false),
	('eb9612d2-2e47-4e03-88ab-cb54d38f371a', '90d33dcc-daef-4a1b-99a7-e7108a03ca47', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692418/dec-walls/external/pyariwalls/WhatsAppImage2023-06-06at4.22.47PM_1_1724ea20-70c5-4e8b-ad14-16b1bce42042.jpg', 'Surah Ikhlas Round Wall Plaque', 1, false, true),
	('512a8a59-9d58-47e9-a16d-86984265d91b', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692418/dec-walls/external/pyariwalls/WhatsAppImage2023-06-06at4.22.47PM_1_1724ea20-70c5-4e8b-ad14-16b1bce42042.jpg', 'Dua-e-Nad-e-Ali Wall Art', 0, true, false),
	('4763b4e8-554f-48b2-9c4d-73fa209eea5e', 'a88c131c-7dd5-41f2-9aeb-c1a747a4eb1b', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692418/dec-walls/external/pyariwalls/WhatsAppImage2023-10-06at5.09.54PM.jpg', 'Dua-e-Nad-e-Ali Wall Art', 1, false, true),
	('e996b477-fdac-4f5e-9944-c18fad4461bf', 'e0016288-fa07-42ce-be3c-d712d1833301', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692418/dec-walls/external/pyariwalls/WhatsAppImage2023-10-06at5.09.54PM.jpg', 'Ramadan Kareem Calligraphy Decor', 0, true, false),
	('a02aff2f-ce49-4250-83a2-f693f3a1d6e5', 'e0016288-fa07-42ce-be3c-d712d1833301', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692419/dec-walls/external/pyariwalls/Asset31.png', 'Ramadan Kareem Calligraphy Decor', 1, false, true),
	('945f6f90-3a5f-4b3a-a78e-99766b637de6', '173aabab-f539-440c-a451-16e9ccba6f64', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692419/dec-walls/external/pyariwalls/Asset31.png', 'Golden Ayat Calligraphy Panel', 0, true, false),
	('b2599fdb-305d-4bde-ad95-aeeda3cf15f8', '173aabab-f539-440c-a451-16e9ccba6f64', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692420/dec-walls/external/pyariwalls/Asset34.png', 'Golden Ayat Calligraphy Panel', 1, false, true),
	('5c72ed28-61f0-4daa-aaf9-c5f9c06ff016', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692420/dec-walls/external/pyariwalls/Asset34.png', 'Islamic Geometric Calligraphy Set', 0, true, false),
	('dc24fd09-03d4-49d8-9fad-a2653c785b8d', 'e4d94d3e-60da-4b28-8d8d-60354be08f01', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692420/dec-walls/external/pyariwalls/IMG_6692.jpg', 'Islamic Geometric Calligraphy Set', 1, false, true),
	('9a153139-fad8-421e-bba0-22243f7710fe', '668de9a1-e76c-487e-82ed-935b5e13c22e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692420/dec-walls/external/pyariwalls/IMG_6692.jpg', 'Kaaba Masjid Al-Haram Canvas Set', 0, true, false),
	('9b226bbd-cdc4-4b00-9ce4-f1f081c7071e', '668de9a1-e76c-487e-82ed-935b5e13c22e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692421/dec-walls/external/pyariwalls/NadEali_960x-2_960x_afd07597-2c70-4975-8f2c-83ae5b2d5c29.jpg', 'Kaaba Masjid Al-Haram Canvas Set', 1, false, true),
	('ef9acc93-33ee-4742-8795-401e58947f1f', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692421/dec-walls/external/pyariwalls/NadEali_960x-2_960x_afd07597-2c70-4975-8f2c-83ae5b2d5c29.jpg', 'Sher-e-Khuda Calligraphy Art', 0, true, false),
	('e30e7938-1a1a-42a9-b40c-9b251ad85b29', '16168a3c-f848-43e1-904e-8ebefbc98a6f', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692422/dec-walls/external/pyariwalls/Asset30.png', 'Sher-e-Khuda Calligraphy Art', 1, false, true),
	('a76198ba-c7e2-4247-9a0e-f8ce4e349d81', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692422/dec-walls/external/pyariwalls/Asset30.png', 'Minimalist Acrylic Allah Decor', 0, true, false),
	('71c479c9-bd07-463c-9fb4-fee1acb90ece', '6df08ea7-ede2-49a1-8bda-813fda042b8e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692422/dec-walls/external/pyariwalls/Asset26.png', 'Minimalist Acrylic Allah Decor', 1, false, true),
	('adfe94b8-ea17-4bdf-b5af-134a208b2c39', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692422/dec-walls/external/pyariwalls/Asset26.png', 'Modern Islamic Acrylic Wall Panel', 0, true, false),
	('38a75bb8-99a1-4947-9164-3ce2f62a5936', 'bd63f507-6f03-4c64-acdf-770aea8c4d91', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692423/dec-walls/external/pyariwalls/WhatsAppImage2022-02-17at12.47.42AM.jpg', 'Modern Islamic Acrylic Wall Panel', 1, false, true),
	('b6808e33-06e7-4603-b3de-b88fc30f38aa', '73b9e4d5-a375-4653-bd5a-485a423fd912', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692423/dec-walls/external/pyariwalls/WhatsAppImage2022-02-17at12.47.42AM.jpg', 'Islamic Wooden Frame Wall Decor', 0, true, false),
	('7c3f5965-3ac7-452c-87e3-0b69ffea42e3', '73b9e4d5-a375-4653-bd5a-485a423fd912', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692424/dec-walls/external/pyariwalls/Asset33.png', 'Islamic Wooden Frame Wall Decor', 1, false, true),
	('447e64a7-8821-4785-84c6-1dda86494793', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692424/dec-walls/external/pyariwalls/Asset33.png', 'Allah Muhammad Scenic Wall Art', 0, true, false),
	('bd0b5462-e7da-4ad6-bc59-4becbc5e415c', 'be61789a-9a2f-4e54-b10a-31bdb39bcf16', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692424/dec-walls/external/pyariwalls/WhatsAppImage2023-07-22at5.58.36PM.jpg', 'Allah Muhammad Scenic Wall Art', 1, false, true),
	('e456f824-fa6f-4baf-b4ac-6a429afb2795', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692424/dec-walls/external/pyariwalls/WhatsAppImage2023-07-22at5.58.36PM.jpg', 'Acrylic Mirror Flower Wall Set', 0, true, false),
	('3e95cf1b-5da0-49f2-9f34-275005d16d47', 'edc3c1da-a4e7-4b3a-9bfb-7860f8d4f315', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692425/dec-walls/external/pyariwalls/WhatsAppImage2023-08-05at4.39.38PM.jpg', 'Acrylic Mirror Flower Wall Set', 1, false, true),
	('7590fc82-3f87-41f3-acc1-753ea59063f9', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692425/dec-walls/external/pyariwalls/WhatsAppImage2023-08-05at4.39.38PM.jpg', 'Geometric Acrylic Mirror Decor', 0, true, false),
	('bbf92397-d187-4f7a-a3d3-90816cc7fd59', 'bb32bf45-9a50-4497-8a5c-34783c073e2c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692426/dec-walls/external/pyariwalls/ScreenShot2022-10-28at4.36.46PM.png', 'Geometric Acrylic Mirror Decor', 1, false, true),
	('69e0657a-21e4-4837-91d5-1ea86da652a2', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692426/dec-walls/external/pyariwalls/ScreenShot2022-10-28at4.36.46PM.png', 'Modern Acrylic Wall Mirror Set', 0, true, false),
	('6eff7ed0-52d6-4fb9-91fc-e13c10f879e0', 'bce22b2f-effa-4212-8a22-766b2f34f02a', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692427/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-30-at-8.53.07-PM-1-2_50b8a524-2bb5-45d6-9e3e-363edab9730e.jpg', 'Modern Acrylic Wall Mirror Set', 1, false, true),
	('fba614da-51d9-4822-a6b5-089e89269dac', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692427/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-30-at-8.53.07-PM-1-2_50b8a524-2bb5-45d6-9e3e-363edab9730e.jpg', 'Decorative Acrylic Mirror Tiles', 0, true, false),
	('fdf08e31-a2b3-42b1-bbff-efc99cb20c35', 'f09ad9fc-7c41-4714-b420-16c9ccb02b89', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692427/dec-walls/external/pyariwalls/WhatsApp-Image-2020-10-11-at-6.08.38-PM_d387628c-59fb-4593-9f88-3201b7205328.jpg', 'Decorative Acrylic Mirror Tiles', 1, false, true),
	('5aeca974-e94f-4cb2-b827-6289cf87b8a6', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692427/dec-walls/external/pyariwalls/WhatsApp-Image-2020-10-11-at-6.08.38-PM_d387628c-59fb-4593-9f88-3201b7205328.jpg', 'DIY Reflective Mirror Wall Decals', 0, true, false),
	('9a48798e-44df-45c6-bddd-4056cd4d12d9', 'af07836e-75c4-4e9b-ab36-2f315ef8017d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692428/dec-walls/external/pyariwalls/mainimage23D-DIY-Wall-Mirror-Stickers-Reflective-Surface-Oval-Square-Acrylic-Stickers-Home-Bathroom-Decals-Living-Room_1000x_5e3efe47-38b7-4861-909b-b3511f4c6293.jpg', 'DIY Reflective Mirror Wall Decals', 1, false, true),
	('baeae031-4273-488c-98fe-9bf3d68d6215', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692428/dec-walls/external/pyariwalls/mainimage23D-DIY-Wall-Mirror-Stickers-Reflective-Surface-Oval-Square-Acrylic-Stickers-Home-Bathroom-Decals-Living-Room_1000x_5e3efe47-38b7-4861-909b-b3511f4c6293.jpg', 'Silver Hexagon Mirror Decor', 0, true, false),
	('10ea44ec-9272-46ee-8ccb-60e49a0c710e', '9d5708d2-bb10-4da3-9caf-4b58cf9fd2d2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692429/dec-walls/external/pyariwalls/zzmirror2.jpg', 'Silver Hexagon Mirror Decor', 1, false, true),
	('98f2e53a-0603-440c-b5b6-7a336e9552bc', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692429/dec-walls/external/pyariwalls/zzmirror2.jpg', 'Gold Acrylic Islamic Wall Decor', 0, true, false),
	('8787cf3d-439c-489f-9980-7bbee6b1eb99', 'e9d377d4-5897-44fd-ae81-1a2d2f299145', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692429/dec-walls/external/pyariwalls/IMG_0371.jpg', 'Gold Acrylic Islamic Wall Decor', 1, false, true),
	('f96c7a7e-4e57-4d4a-8165-dc229c23c6ab', '3f85931f-ea9b-480c-b6c2-3411e575c185', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692429/dec-walls/external/pyariwalls/IMG_0371.jpg', 'Modern Acrylic Calligraphy Wall Art', 0, true, false),
	('45198a31-e682-43ab-81d3-4cf444b0ceec', '3f85931f-ea9b-480c-b6c2-3411e575c185', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692430/dec-walls/external/pyariwalls/166236023329ef1870a4d66aa850f4b03a5ad5570c_thumbnail_900x_4a8a4adf-da3d-4a45-bd9a-c4f1dd69f099.jpg', 'Modern Acrylic Calligraphy Wall Art', 1, false, true),
	('afa1a06a-911b-4903-9dc7-7a2759408b6f', '546758f9-a2a8-41f3-b628-506123efb59e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692430/dec-walls/external/pyariwalls/166236023329ef1870a4d66aa850f4b03a5ad5570c_thumbnail_900x_4a8a4adf-da3d-4a45-bd9a-c4f1dd69f099.jpg', 'Premium Gold Islamic Wall Hanging', 0, true, false),
	('5559b91b-26b5-4e57-81db-a6291a2936bd', '546758f9-a2a8-41f3-b628-506123efb59e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692431/dec-walls/external/pyariwalls/WhatsAppImage2022-04-10at6.22.07PM.jpg', 'Premium Gold Islamic Wall Hanging', 1, false, true),
	('68f23d46-ea21-4e7f-91af-ce8e2a427ede', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692431/dec-walls/external/pyariwalls/WhatsAppImage2022-04-10at6.22.07PM.jpg', 'Acrylic Ayat-ul-Kursi Statement Art', 0, true, false),
	('78e2f40f-63e7-4b21-ac42-514d2fb3ee61', '180a86d4-6e10-4aeb-b238-8966b45d61e5', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692432/dec-walls/external/pyariwalls/premiumromangolden.jpg', 'Acrylic Ayat-ul-Kursi Statement Art', 1, false, true),
	('f2cec782-fabe-4070-9307-e6669685cc2c', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692432/dec-walls/external/pyariwalls/premiumromangolden.jpg', 'Decorative Acrylic Islamic Plaque', 0, true, false),
	('ab00c080-ae1c-44d0-af16-acedea4f40e3', 'a21a0ca3-38b2-45c4-b616-00d1a9fa0a34', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692433/dec-walls/external/pyariwalls/6ec23a351808ec93db4c46b23a934e60.jpg', 'Decorative Acrylic Islamic Plaque', 1, false, true),
	('630faab9-215b-4908-9082-534570069158', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692433/dec-walls/external/pyariwalls/6ec23a351808ec93db4c46b23a934e60.jpg', 'Modern Gold Acrylic Wall Accents', 0, true, false),
	('fb757576-40ac-46cf-92dd-1bc118937d71', 'ac79712f-8018-48a6-a1c2-4b8bd97718b6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692433/dec-walls/external/pyariwalls/FullSizeRender2.jpg', 'Modern Gold Acrylic Wall Accents', 1, false, true),
	('918da890-5bac-462b-80bb-f2d1c2e7e736', 'e0380f4a-1830-40d9-a642-61962dc99f84', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692433/dec-walls/external/pyariwalls/FullSizeRender2.jpg', 'Custom Family Name Wall Sign', 0, true, false),
	('5937f787-4250-4f5c-a6c8-b22b1ea0f467', 'e0380f4a-1830-40d9-a642-61962dc99f84', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692434/dec-walls/external/pyariwalls/WhatsAppImage2024-02-28at19.50.45_2.jpg', 'Custom Family Name Wall Sign', 1, false, true),
	('aee9153d-1b53-4a57-93ef-8b1058f5c39b', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692434/dec-walls/external/pyariwalls/WhatsAppImage2024-02-28at19.50.45_2.jpg', 'Laser Cut Floral Wall Frame', 0, true, false),
	('f4cad18d-6881-4c70-8e1c-f07ef1134fc3', 'd1b2b956-b73d-4317-9fab-817f4ef0309e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692435/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-5.jpg', 'Laser Cut Floral Wall Frame', 1, false, true),
	('8d0b791f-08ba-4011-9d99-2febbfb92efa', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692435/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-5.jpg', 'Decorative Quote Wall Plaque', 0, true, false),
	('ce789ff0-a510-4154-8dff-bea71a7cfc78', '6394b534-ac01-4e83-8bc4-b4e7c7b97120', 'https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-11-02-at-3.29.42-PM_a88134d9-3bf8-499b-9e7d-e3f6508ba110.jpg?v=1613750392&width=533', 'Decorative Quote Wall Plaque', 1, false, true),
	('ec477a22-276f-4f67-9035-722264e1c906', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 'https://pyariwalls.pk/cdn/shop/products/WhatsApp-Image-2020-11-02-at-3.29.42-PM_a88134d9-3bf8-499b-9e7d-e3f6508ba110.jpg?v=1613750392&width=533', 'Couple Name Personalized Wall Art', 0, true, false),
	('001a3fa0-c49b-43d8-9d3c-4124612437d5', '48588c28-fff9-4ca2-a764-ac0f99dcb3b8', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-9-copy_71107990-9143-46fe-a08e-2685423e19cb.jpg', 'Couple Name Personalized Wall Art', 1, false, true),
	('9b66af17-268d-427b-ba9f-b06a78798e14', '356dbafa-3027-4daf-8888-59d8de2957c0', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-9-copy_71107990-9143-46fe-a08e-2685423e19cb.jpg', 'Wooden Islamic Wall Clock', 0, true, false),
	('860dee58-ec70-456a-90fc-5c1cf373507f', '356dbafa-3027-4daf-8888-59d8de2957c0', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-12-1_3b4e8024-0c43-46c0-b03a-b3e47ed4bd57.jpg', 'Wooden Islamic Wall Clock', 1, false, true),
	('7bda56a9-a89e-4e5e-af3a-30cf5b5f66c9', '65b72e18-cab5-4c72-aaac-747e9093267e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-12-1_3b4e8024-0c43-46c0-b03a-b3e47ed4bd57.jpg', 'Acrylic Islamic Wall Clock', 0, true, false),
	('e6e7dc0a-a7ac-49c9-8c29-816a8552ca5e', '65b72e18-cab5-4c72-aaac-747e9093267e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692437/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-11.42.35-PM_020b63ea-559e-473a-8303-c1bc57fe5235.jpg', 'Acrylic Islamic Wall Clock', 1, false, true),
	('4690b837-9f7f-4169-801b-65488cac6e92', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692437/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-11.42.35-PM_020b63ea-559e-473a-8303-c1bc57fe5235.jpg', 'Birds on Branches Pendulum Clock', 0, true, false),
	('a242b7d7-3c2d-4e94-8760-d765d3aaaabb', '8f7d80ca-ea75-4db1-a4e1-7271c1a9c286', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692438/dec-walls/external/pyariwalls/1660535743f0b2c7702631e0c1847e64bc40f8633f.jpg', 'Birds on Branches Pendulum Clock', 1, false, true),
	('5c2d5530-ebdf-48ae-bbbb-aa0ac71d9d2b', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692438/dec-walls/external/pyariwalls/1660535743f0b2c7702631e0c1847e64bc40f8633f.jpg', 'Classic Designer Wall Clock', 0, true, false),
	('9f0a93e7-6dea-4058-988d-249e85fd7561', '1a77ec11-4222-4b3a-b482-49c6d36c529d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/grazingdeer.jpg', 'Classic Designer Wall Clock', 1, false, true),
	('24032c18-c3f2-4385-9778-a5246d31d57e', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/grazingdeer.jpg', 'Modern Office Wall Clock', 0, true, false),
	('d410910a-1fac-4d7f-9666-7bf6ece05ab2', '6ac0fcd0-1984-4236-acb1-3d97e561b943', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/Asset65.png', 'Modern Office Wall Clock', 1, false, true),
	('98506c4b-3b0c-42b0-adad-fbad357bc8c6', '1fd1e82f-4864-4473-a64c-9ca433878873', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/Asset65.png', 'Large DIY Statement Wall Clock', 0, true, false),
	('dbbf7075-3f51-4383-b498-bb4f9858af65', '1fd1e82f-4864-4473-a64c-9ca433878873', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692440/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-5.21.19-PM.jpg', 'Large DIY Statement Wall Clock', 1, false, true),
	('919d947b-5bef-4761-8e6d-6091b6a695f8', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692440/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-5.21.19-PM.jpg', 'Islamic Calligraphy Clock Decor', 0, true, false),
	('795cba8c-a50e-4f38-97f5-28b4f47b08f0', 'e0b60e48-3336-4084-97da-9aa08977a2ad', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/Asset66.png', 'Islamic Calligraphy Clock Decor', 1, false, true),
	('61e195d5-1982-4d17-85f5-7693a58d0091', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/Asset66.png', 'Neon Style Decorative Wall Clock', 0, true, false),
	('c9498a92-6a09-4e52-be15-c174d2bd5f8a', 'cded907b-2494-4e6e-b8d8-5ab434bbd37e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/IMG_71392.jpg', 'Neon Style Decorative Wall Clock', 1, false, true),
	('9b69aed7-831b-4a5b-885d-00f194812f57', '09b07e4a-209b-41e0-9343-a4650c533772', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/IMG_71392.jpg', 'Nature Reflection Canvas Art', 0, true, false),
	('f8796f57-4c51-4c47-a824-e3cc7290a25f', '09b07e4a-209b-41e0-9343-a4650c533772', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692442/dec-walls/external/pyariwalls/WhatsApp_Image_2025-08-21_at_15.04.42_50x50.jpg', 'Nature Reflection Canvas Art', 1, false, true),
	('85f96a2f-bd60-4cd8-ae22-64f020555d83', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692442/dec-walls/external/pyariwalls/WhatsApp_Image_2025-08-21_at_15.04.42_50x50.jpg', 'Kids Learning Wall Art Set', 0, true, false),
	('899bd23a-87a8-4dab-895b-2706f9686209', 'f2e566a6-20fe-4d09-841a-c2e1eaceaca2', 'https://pyariwalls.pk/cdn/shop/products/Asset64.png?v=1645474548&width=533', 'Kids Learning Wall Art Set', 1, false, true),
	('aed6106a-8e4d-4e39-a48b-04c261f92726', 'a8df81fd-7d1c-4bb0-9825-2d081774c10d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692367/dec-walls/products/csv/csv-product-01.jpg', 'The Naqsh Trio – Gold & Black Engraved Nesting Tables (Set of 3)', 0, true, false),
	('3fcdfdef-77f0-4c0d-aaa4-b1e7275f37eb', 'd5c4195a-6841-46ca-83af-b4df011d7984', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692368/dec-walls/products/csv/csv-product-02.jpg', 'The Carrara Trio – White Marble-Look Nesting Tables (Set of 3)', 0, true, false),
	('a2782160-7a99-4fac-ae66-8fd60fe5b13e', 'acc68cea-54b8-4248-a20d-291930c71f2a', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692369/dec-walls/products/csv/csv-product-03.jpg', 'The Xandra Trio – Woodgrain Nesting Tables (Set of 3)', 0, true, false),
	('a3f0f354-6a6b-4f89-8dbd-d631ed48bdbb', 'ddc38436-5ef4-4877-a360-4f05211911c7', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692370/dec-walls/products/csv/csv-product-04.jpg', 'Royal Mandala Gold & Black Engraved Nesting Tables (Set of 3)', 0, true, false),
	('f38fdca5-b34e-4172-b780-ee651ea0f4e4', '7cfbf2ff-ac98-403e-ba44-dc7def77fe8c', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692371/dec-walls/products/csv/csv-product-05.jpg', 'The Contrast Duo – Woodgrain & Charcoal Nesting Coffee Tables', 0, true, false),
	('e5bfb1be-0a34-4854-8788-54050f5b7707', '51c7432b-ca4c-4f73-ae6d-d90eff7b35bf', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692372/dec-walls/products/csv/csv-product-06.jpg', 'The Slate Trio – Matte Charcoal Nesting Tables (Set of 3)', 0, true, false),
	('7fd27147-0ead-4dd2-95fd-22bc75468444', '2d557c88-c4be-4dba-94fc-f5d2206b8d78', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692373/dec-walls/products/csv/csv-product-07.jpg', 'Wood & Black Steel Round Nesting Tables (Set of 3)', 0, true, false),
	('5991db99-694e-4a1f-9490-ba3269c515de', 'b98c1283-ecf9-4dcc-82a8-c081ba903de6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692374/dec-walls/products/csv/csv-product-08.jpg', 'The Timber Trio – Rustic Woodgrain Nesting Tables (Set of 3)', 0, true, false),
	('4003358b-b4f4-4187-b308-0a2ee19bff95', '89d4c501-3d22-4929-a78a-5fcb5f2633d7', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692375/dec-walls/products/csv/csv-product-09.jpg', 'The Eclipse Duo – Matte Charcoal Nesting Coffee Tables (Set of 2)', 0, true, false),
	('e9f5687c-5396-49a7-866d-9ccb240a5721', 'eacc555d-20ea-4c87-97cf-5cdb2a8b0faf', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692376/dec-walls/products/csv/csv-product-10.jpg', 'The Nordic Trio – Matte Honey-Blonde Nesting Tables (Set of 3)', 0, true, false),
	('9f693ec9-5f5c-4d40-be90-3ecf2d0c0145', '0deeebb7-53fd-4847-b18b-605cb8b0a6b9', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692377/dec-walls/products/csv/csv-product-11.jpg', 'The Cascade Trio – Modern Wood & Metal Side Tables', 0, true, false),
	('24b01e90-d791-4198-ba22-d83273a65d13', '438e2ec6-2e92-459c-b843-c0c4ce5ef68d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692378/dec-walls/products/csv/csv-product-12.jpg', 'The Vertex Duo – Modern Wood & Metal Side Tables', 0, true, false),
	('70cb4de7-d5bc-4f87-af5d-1406ae9e37d7', '86d8f03c-ab47-42ba-b97f-8f9e03798f03', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692379/dec-walls/products/csv/csv-product-13.jpg', 'The Crosswood Round Side Table – Wood & Black Steel', 0, true, false),
	('643de195-3913-40e2-91e2-457fa3766342', 'aedebcae-88ec-49a1-9727-968e07c54a3d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692379/dec-walls/products/csv/csv-product-14.jpg', '3-Tier Wooden & Steel Kitchen Serving Trolley – Large', 0, true, false),
	('a6cbddf4-5deb-4378-abbb-26f2debad8d7', 'cceec074-07a4-41e1-9686-373bbc7b90a6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692380/dec-walls/products/csv/csv-product-15.jpg', 'The LumaLine – Gold Geometric LED Table Lamp (Touch + Type-C)', 0, true, false),
	('60e876fc-50db-4b84-941a-96d90438ec66', '877dd4cf-fdfa-4e97-bf0c-ac7db5d08789', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692381/dec-walls/products/csv/csv-product-16.jpg', 'The Aurelia Glow – Luxury Gold Leaf LED Table Lamp', 0, true, false),
	('2419a741-fafc-46ed-adc0-29c05acf1607', '945ee356-4a88-45cc-ab3e-953158a5f89f', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692382/dec-walls/products/csv/csv-product-17.jpg', 'The Elara Glow – Luxury Bedside Lamp (Touch + Type-C)', 0, true, false),
	('68cbdc95-0b83-41ab-b305-10dce14e5d1b', '3810cd1c-785e-45b0-9156-b4c02e26015d', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692383/dec-walls/products/csv/csv-product-18.jpg', 'The Lumora – Golden Crystal Table Lamp (Touch + Type-C)', 0, true, false),
	('b02c1103-b220-47ca-bebf-088c60806652', 'ec1a309e-9c7b-41bd-b38b-6dfb79dbdeb1', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692384/dec-walls/products/csv/csv-product-19.jpg', 'Crystal Oval LED Table Lamp (Touch + Type-C)', 0, true, false),
	('580ec370-039a-4083-bbfa-1e3a98ac9a64', 'e602e9f1-8356-4943-8bbc-5dd731063740', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692385/dec-walls/products/csv/csv-product-20.jpg', 'Barakah Mirror Acrylic Wall Decor – 3 Piece Set', 0, true, false),
	('19f51c59-69d0-4450-aafe-186137505dba', '6e3e291a-24f3-44cd-8510-4146fa4087a0', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692386/dec-walls/products/csv/csv-product-21.jpg', 'Durood Shareef Acrylic Wall Art 2026', 0, true, false),
	('7943afec-6118-41e9-9490-fec86bd85d94', 'e3fce6b9-93ba-4b92-b3d7-cc7d3b4630eb', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692387/dec-walls/products/csv/csv-product-22.jpg', 'Gold Acrylic Ayatul Kursi Wall Art – Luxury Islamic Decor', 0, true, false),
	('594fbcdb-1c44-4244-9d01-69b70bdff7be', '0b774948-d62b-49f2-8658-62c86afd399e', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692388/dec-walls/products/csv/csv-product-23.jpg', 'Ayatul Kursi Premium Calligraphy – Rectangle (Black/Gold)', 0, true, false),
	('8599431c-31f6-4901-b0b5-6e52d1fc422f', 'b6f69257-b04c-404f-8067-2f18564b17cb', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692389/dec-walls/products/csv/csv-product-24.jpg', 'Zulfiqar-e-Ali Golden/Black Premium Wall Art', 0, true, false),
	('27be86f8-09fd-4e6f-9560-d824034f694c', '04722b45-b32f-4b52-8a6f-eb9560a6cc35', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692390/dec-walls/products/csv/csv-product-25.jpg', 'Ayat-ul-Kursi Grand Calligraphy Panel (24 × 48 in)', 0, true, false),
	('35784fee-9d49-4513-b668-27273d044e0a', 'ef2ab5ad-dbb3-4d56-a27a-e037494d6ae6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692391/dec-walls/products/csv/csv-product-26.jpg', 'Saif-e-Ali Premium Wall Art Decor', 0, true, false),
	('b3d7ce95-b6a3-42e2-837b-dd557602cecd', '9bd5d093-51a0-4111-a0e9-a128790823a8', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692392/dec-walls/products/csv/csv-product-27.jpg', 'Makka Kiswah Kaaba Door / Madina Jali Acrylic Wall Decor', 0, true, false),
	('57baad9c-d9c0-40a3-84e5-81964a7e73eb', '76be4aec-4e09-49d7-b902-64e0bd4ab5e0', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692393/dec-walls/products/csv/csv-product-28.jpg', 'Divine Gold Asma-ul-Husna Frame Acrylic', 0, true, false),
	('b01d7ef7-987a-405a-96c6-fbaeaa5622c8', '1dd08759-a527-4ce2-873b-91e0736787b9', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692394/dec-walls/products/csv/csv-product-29.jpg', 'Start with Bismillah, End with Alhamdulillah – Set of 2', 0, true, false),
	('e1688d1b-3e86-4f47-96b4-5b8da900a652', '0d157c92-7e5b-416a-b583-3d7848f9deb1', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692395/dec-walls/products/csv/csv-product-30.jpg', 'Buy 1 Get 2 Free Calligraphies', 0, true, false),
	('968645ce-02ec-4ca7-85ed-042bcbe39f8e', '96b5b6e1-7206-4ccb-b71f-9986fa9a7001', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692440/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-5.21.19-PM.jpg', 'Zeenat-e-Waqt – Islamic Calligraphy Wall Clock (Gold/Black)', 0, true, false),
	('faeaab40-5142-4e09-a265-dd6da84d7344', '4a0fb052-d93c-48f0-b85a-359a2019e2da', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/Asset66.png', 'Noor-e-Zaman Premium Wall Clock Set – 3 Panel Decor', 0, true, false),
	('944481ec-aefc-4434-a4c2-636956185bcb', 'b6a4a634-6c8f-4ae2-b4a7-8f24d997f21b', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-9-copy_71107990-9143-46fe-a08e-2685423e19cb.jpg', 'Surah Ikhlas Wall Clock', 0, true, false),
	('1c12ad0b-8fe7-4f5a-b9c7-7544f27ee55d', '81fac16a-0f41-4010-b77b-c445df6ef4e2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692436/dec-walls/external/pyariwalls/WhatsApp-Image-2020-08-17-at-12.48.08-PM-12-1_3b4e8024-0c43-46c0-b03a-b3e47ed4bd57.jpg', 'Birds on Branches Scenic Pendulum Clock', 0, true, false),
	('893b6509-fc5c-4244-9c25-12162c2213c1', 'd324d689-8609-485c-873c-be8a56440940', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692437/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-11.42.35-PM_020b63ea-559e-473a-8303-c1bc57fe5235.jpg', 'Modern Acrylic Wall Clock', 0, true, false),
	('f1f94ee2-bbcf-4a38-9b92-0b11cfe83adf', 'b743b7db-272e-4e94-802e-7c8a222b5ece', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692438/dec-walls/external/pyariwalls/1660535743f0b2c7702631e0c1847e64bc40f8633f.jpg', 'World Map Wall Clock', 0, true, false),
	('daa543af-6acf-4a35-abb8-2e400d1e20cb', '42559937-d01a-4be6-b959-194d69bcdf97', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/grazingdeer.jpg', 'Large Size Wooden DIY Clock with 12-Inch Needles', 0, true, false),
	('7b8294eb-26ef-4566-b145-d675e5566898', '00024bd1-77ca-46c3-9748-b7b8218f2230', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692439/dec-walls/external/pyariwalls/Asset65.png', 'We Are Family Clock with White Dial', 0, true, false),
	('bfafd6ee-0a2e-4159-95ec-702a046123ca', '80735d36-0d1d-4b3a-9fdb-e897a2f39fe0', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692440/dec-walls/external/pyariwalls/WhatsApp-Image-2020-11-03-at-5.21.19-PM.jpg', 'Modern Style Neon X Clock Ambient Light', 0, true, false),
	('efa0dd43-60d5-4b42-b337-6fec40f85db0', '93ea99b8-3ae9-44d9-a1b3-24bd1e616deb', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692441/dec-walls/external/pyariwalls/Asset66.png', 'Neon Decorative Wall Art Clock', 0, true, false),
	('761e2db4-342b-410c-919c-92f435aec873', '8602d310-085a-4f9d-8f61-a3dbc278fdc6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692427/dec-walls/external/pyariwalls/WhatsApp-Image-2020-10-11-at-6.08.38-PM_d387628c-59fb-4593-9f88-3201b7205328.jpg', 'Acrylic Hexagon Wall Decor Mirror (Gold)', 0, true, false),
	('1234a528-0cb7-42bd-8d1c-f164c46b96af', '8d2b0369-597e-42ab-b830-678091e8afb7', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692428/dec-walls/external/pyariwalls/mainimage23D-DIY-Wall-Mirror-Stickers-Reflective-Surface-Oval-Square-Acrylic-Stickers-Home-Bathroom-Decals-Living-Room_1000x_5e3efe47-38b7-4861-909b-b3511f4c6293.jpg', 'Acrylic Hexagon Wall Decor Mirror (Silver)', 0, true, false),
	('0e0ec261-5934-49e3-9c1a-b01d030a9e47', 'ffa8e850-e7ab-48c8-b098-93d692cc2b91', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692424/dec-walls/external/pyariwalls/WhatsAppImage2023-07-22at5.58.36PM.jpg', 'Premium Acrylic Leaf Mirror', 0, true, false),
	('f5ef7772-5692-4149-a91c-d504285f16b1', 'b65d6726-05d5-4582-a5f0-405c90d106e2', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692425/dec-walls/external/pyariwalls/WhatsAppImage2023-08-05at4.39.38PM.jpg', 'Neon Selfie Acrylic Mirror for Room Walls', 0, true, false),
	('84fbf91d-7ac1-4558-8fcc-a485f389e795', 'df5b2a8f-4d3e-4107-af13-1a709c857ebf', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692426/dec-walls/external/pyariwalls/ScreenShot2022-10-28at4.36.46PM.png', 'Unbreakable Imported Acrylic Mirror (Self-Adhesive)', 0, true, false),
	('49005c08-86e4-44a2-95eb-0af12d148a99', 'd4f0bfb5-0f08-4a26-a328-9f66778868f9', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692332/dec-walls/home/banner-a1.jpg', 'DIY Miniature Shelves Wooden', 0, true, false),
	('64bd7848-4076-498a-9d2c-4384f6b3a564', 'd7ce6a23-5c60-42ed-bf31-86b51a50aae6', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692332/dec-walls/home/banner-a1.jpg', 'LED Candles for Shelves Decor', 0, true, false),
	('f628b872-753f-46d0-ac6c-8536f410ba96', '2e77c73e-df16-4867-aec2-a4e3e0f148e9', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692332/dec-walls/home/banner-a1.jpg', 'Together We Are Family Frames (12 Frames)', 0, true, false),
	('c1c8f6fa-0c3f-45dd-afe1-266e628324fe', '17124218-20c5-4358-be39-690fc31db672', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692334/dec-walls/home/banner-a3.jpg', 'Kids Magic Practice Book Set of 4 + 10 Refill Pens', 0, true, false),
	('648b9e98-9845-463c-a5f4-b8d80bf82211', '3f27581f-5e6b-469f-ae16-e3f40026e3f8', 'https://res.cloudinary.com/wleggyxw/image/upload/v1795692334/dec-walls/home/banner-a3.jpg', '3-in-1 Wooden Montessori Board (Vowels, Numbers, Shapes)', 0, true, false);


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: seo_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

-- \unrestrict Eqsn8uGA0YrdOLzbimTSyf75ypcui4UMz8mfMqV2dha5TKPpxPcaz5jXa0iRr81

RESET ALL;
