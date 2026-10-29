--
-- PostgreSQL database dump
--

\restrict 4UV48p9Ndzu9I5TWbhC7LhDXfLwy5XbW7gYbf1F0keykcKafH9KglrZXxcptyei

-- Dumped from database version 15.19 (Debian 15.19-1.pgdg13+2)
-- Dumped by pg_dump version 15.19 (Debian 15.19-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO myuser;

--
-- Name: ai_analyses; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.ai_analyses (
    id integer NOT NULL,
    content_id integer NOT NULL,
    topic text NOT NULL,
    category text NOT NULL,
    content_type text NOT NULL,
    sentiment text NOT NULL,
    keywords jsonb NOT NULL,
    summary text NOT NULL,
    target_audience text NOT NULL,
    key_message text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ai_analyses OWNER TO myuser;

--
-- Name: ai_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.ai_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ai_analyses_id_seq OWNER TO myuser;

--
-- Name: ai_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.ai_analyses_id_seq OWNED BY public.ai_analyses.id;


--
-- Name: auth_sessions; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.auth_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.auth_sessions OWNER TO myuser;

--
-- Name: competitors; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.competitors (
    id integer NOT NULL,
    name text NOT NULL,
    platform text NOT NULL,
    channel_id text NOT NULL,
    url text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.competitors OWNER TO myuser;

--
-- Name: competitors_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.competitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.competitors_id_seq OWNER TO myuser;

--
-- Name: competitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.competitors_id_seq OWNED BY public.competitors.id;


--
-- Name: monitoring_alerts; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.monitoring_alerts (
    id integer NOT NULL,
    content_id integer NOT NULL,
    competitor_id integer NOT NULL,
    platform text NOT NULL,
    alert_type text NOT NULL,
    message text NOT NULL,
    views_change integer NOT NULL,
    likes_change integer NOT NULL,
    comments_change integer NOT NULL,
    views_growth_rate double precision NOT NULL,
    likes_growth_rate double precision NOT NULL,
    comments_growth_rate double precision NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.monitoring_alerts OWNER TO myuser;

--
-- Name: monitoring_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.monitoring_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.monitoring_alerts_id_seq OWNER TO myuser;

--
-- Name: monitoring_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.monitoring_alerts_id_seq OWNED BY public.monitoring_alerts.id;


--
-- Name: performance_analyses; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.performance_analyses (
    id integer NOT NULL,
    competitor_id integer NOT NULL,
    platform text NOT NULL,
    video_count integer NOT NULL,
    total_views integer NOT NULL,
    total_likes integer NOT NULL,
    total_comments integer NOT NULL,
    total_engagement integer NOT NULL,
    average_views double precision NOT NULL,
    average_likes double precision NOT NULL,
    average_comments double precision NOT NULL,
    engagement_rate double precision NOT NULL,
    average_like_rate double precision NOT NULL,
    average_comment_rate double precision NOT NULL,
    performance_rank integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone
);


ALTER TABLE public.performance_analyses OWNER TO myuser;

--
-- Name: performance_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.performance_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performance_analyses_id_seq OWNER TO myuser;

--
-- Name: performance_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.performance_analyses_id_seq OWNED BY public.performance_analyses.id;


--
-- Name: social_contents; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.social_contents (
    id integer NOT NULL,
    competitor_id integer NOT NULL,
    platform text NOT NULL,
    content_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    published_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.social_contents OWNER TO myuser;

--
-- Name: social_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.social_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.social_contents_id_seq OWNER TO myuser;

--
-- Name: social_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.social_contents_id_seq OWNED BY public.social_contents.id;


--
-- Name: social_metrics; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.social_metrics (
    id integer NOT NULL,
    content_id integer NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    comments integer DEFAULT 0 NOT NULL,
    shares integer,
    captured_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.social_metrics OWNER TO myuser;

--
-- Name: social_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public.social_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.social_metrics_id_seq OWNER TO myuser;

--
-- Name: social_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public.social_metrics_id_seq OWNED BY public.social_metrics.id;


--
-- Name: ai_analyses id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.ai_analyses ALTER COLUMN id SET DEFAULT nextval('public.ai_analyses_id_seq'::regclass);


--
-- Name: competitors id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.competitors ALTER COLUMN id SET DEFAULT nextval('public.competitors_id_seq'::regclass);


--
-- Name: monitoring_alerts id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.monitoring_alerts ALTER COLUMN id SET DEFAULT nextval('public.monitoring_alerts_id_seq'::regclass);


--
-- Name: performance_analyses id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performance_analyses ALTER COLUMN id SET DEFAULT nextval('public.performance_analyses_id_seq'::regclass);


--
-- Name: social_contents id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_contents ALTER COLUMN id SET DEFAULT nextval('public.social_contents_id_seq'::regclass);


--
-- Name: social_metrics id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_metrics ALTER COLUMN id SET DEFAULT nextval('public.social_metrics_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d33544d8-4219-46c5-ae6b-6df5d704b89f	47c21a1f3202fbcba4a1728d9ba6d602cb71e13025e38d5f0fbec3263e9ae85c	2026-10-16 12:35:19.110116+00	20261007000000_baseline_core		\N	2026-10-16 12:35:19.110116+00	0
a4ea151c-e3be-4495-9121-3d04981288aa	25b5fc17e5cb248601f16457f45f2ca742b648b0e75a28cb4569e580f2e311c9	2026-10-16 12:35:19.926789+00	20261008000000_add_ai_analysis		\N	2026-10-16 12:35:19.926789+00	0
cd32d9aa-c0de-49b7-a342-76e13a9e5268	d3b086941f29e0b2f7a7f8058b7f7e8c6068a04d3caadba07a1153ee802673aa	2026-10-16 12:35:20.72352+00	20261008100000_add_performance_analysis		\N	2026-10-16 12:35:20.72352+00	0
939d7001-4c77-4450-9ce9-443cc1d97806	7a70d531e9f24f6823413c0118c43b9f3dbd7e68acad19a1f35a601caf51bdd1	2026-10-16 12:35:21.529134+00	20261008200000_add_monitoring_alert		\N	2026-10-16 12:35:21.529134+00	0
e94dff66-8b19-4860-9bc2-5c985bbac1e0	bad15a0e4d515d77e7caab44029a0716f77c4fdd88cda4872b7a1e748fa6b983	2026-10-16 12:35:22.327012+00	20261009131600_add_performance_analysis_updated_at		\N	2026-10-16 12:35:22.327012+00	0
96cdfc62-14f4-417f-b316-915bbdbaffb1	0eabd313d241b8b86b0329e504f2a741a28522e83f2302b4164d9b8796fcb281	2026-10-16 12:35:29.424821+00	20261016123000_cascade_delete_competitor_relations	\N	\N	2026-10-16 12:35:29.404174+00	1
\.


--
-- Data for Name: ai_analyses; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.ai_analyses (id, content_id, topic, category, content_type, sentiment, keywords, summary, target_audience, key_message, created_at) FROM stdin;
138	112	Cuộc thi chơi game Call of Duty với giải thưởng lớn	Giải trí	Thử nghiệm	Tích cực	["Call of Duty", "giải thưởng", "cuộc thi", "DMZ mode", "Modern Warfare 4"]	Video mô tả cuộc thi giữa 10 đội trong chế độ DMZ của Call of Duty với giải thưởng 1.000.000 USD.	Người chơi game, fan của Call of Duty, và những người yêu thích thử thách.	Tham gia cuộc thi chơi game với cơ hội giành giải thưởng lớn và trải nghiệm chế độ mới.	2026-10-22 10:41:52.229
116	109	Nội dung giải trí liên quan đến phim ảnh và văn hóa	Giải trí	Giới thiệu	Tích cực	["phim", "truyện", "Diomio"]	Video giới thiệu kênh Diomio, nơi chia sẻ niềm đam mê với phim và truyện.	Người yêu thích phim ảnh và truyện tranh	Khuyến khích người xem đăng ký kênh và tham gia cộng đồng yêu thích phim ảnh.	2026-10-22 01:32:13.086
137	113	Thử thách Minecraft với phần thưởng tiền	Giải trí	Thử nghiệm	Tích cực	["Minecraft", "thử thách", "tiền thưởng"]	Nội dung video ghi lại thử thách trong Minecraft, nơi người chơi phải sống sót để kiếm tiền thưởng.	Người hâm mộ Minecraft, thanh thiếu niên	Tham gia thử thách và có cơ hội nhận tiền thưởng lớn.	2026-10-22 10:41:52.159
115	107	Sự ngừng phát triển của LEGO Chima và Nexo Knight so với Ninjago	Giải trí	Giải thích	Trung tính	["LEGO Chima", "Nexo Knight", "Ninjago"]	Video thảo luận về lý do tại sao các dòng sản phẩm LEGO Chima và Nexo Knight lại không phát triển như Ninjago.	Người yêu thích LEGO và các fan của series hoạt hình	So sánh sự phát triển giữa các dòng sản phẩm LEGO và nêu lý do cho sự khác biệt này.	2026-10-22 01:32:13.085
113	110	Cuộc chiến giữa hai nhân vật CẠP và ỈON MÂN để tìm ra lý tưởng đúng đắn	Giải trí	Phim tài liệu	Tích cực	["CẠP", "ỈON MÂN", "lý tưởng"]	Video khám phá cuộc chiến lý tưởng giữa hai nhân vật CẠP và ỈON MÂN.	Người yêu thích văn hóa phim ảnh và comic	Nên lựa chọn lý tưởng nào giữa CẠP và ỈON MÂN?	2026-10-22 01:32:13.072
112	106	Phân tích nhân vật Draco Malfoy	Giải trí	Giải thích	Tích cực	["Draco Malfoy", "Harry Potter", "phân tích nhân vật"]	Video phân tích sự hiểu lầm về nhân vật Draco Malfoy trong series Harry Potter.	Những người yêu thích phim và truyện Harry Potter	Mọi người thường hiểu sai về tính cách và vai trò của Draco Malfoy.	2026-10-22 01:32:13.039
114	108	Sức mạnh và đặc điểm của Green Lantern trong DCEU	Giải trí	Giải thích	Tích cực	["Green Lantern", "DCEU", "siêu anh hùng", "văn hóa phim ảnh"]	Video phân tích về nhân vật Green Lantern trong DCEU, bao gồm sức mạnh, điểm yếu và câu chuyện của nhân vật này.	Người yêu thích phim ảnh và truyện tranh, đặc biệt là fan của DCEU	Khám phá sức mạnh và đặc điểm nổi bật của Green Lantern trong vũ trụ điện ảnh DC.	2026-10-22 01:32:13.066
142	114	Tái khám phá thế giới Minecraft sau 13 năm	Giải trí	Thử nghiệm	Tích cực	["Minecraft", "thế giới 13 năm", "MrBeast"]	Video giới thiệu quá trình tái tạo lại thế giới Minecraft đã được xây dựng 13 năm trước với sự chú ý đến từng chi tiết.	Người hâm mộ Minecraft và fan của MrBeast	Khám phá lại những kỷ niệm với thế giới Minecraft trong quá khứ và mời gọi người xem tham gia cộng đồng.	2026-10-22 10:41:52.236
190	118	Bản nhạc buồn của Song Luân dựa trên tác phẩm của Phan Mạnh Quỳnh	Giải trí	Âm nhạc	Tiêu cực	["Song Luân", "Phan Mạnh Quỳnh", "Ngày chưa giông bão"]	Video trình bày bài hát 'Ngày chưa giông bão' do Song Luân thể hiện, mang đến không gian tĩnh lặng và cảm xúc sâu sắc.	Người yêu thích âm nhạc trữ tình, fan của Song Luân và Phan Mạnh Quỳnh	Khoảnh khắc bình yên có thể ẩn chứa nỗi buồn trước cơn bão đến.	2026-10-22 12:59:35.324
187	119	Bài hát 'Một Ngày Hay Trăm Năm' của Văn Mai Hương	Giải trí	Video âm nhạc	Tích cực	["Một Ngày Hay Trăm Năm", "Văn Mai Hương", "Lululola Show"]	Video giới thiệu bài hát 'Một Ngày Hay Trăm Năm' được phối mới năm 2026 tại Lululola Show.	Người yêu thích âm nhạc và văn hóa giải trí	Khám phá phiên bản mới của bài hát nổi tiếng qua Lululola Show.	2026-10-22 12:59:35.249
189	120	Một chàng trai viết lên cây	Giải trí	Âm nhạc	Tích cực	["Có Chàng Trai Viết Lên Cây", "Phan Mạnh Quỳnh", "Lululola Show"]	Video trình bày bài hát 'Có Chàng Trai Viết Lên Cây' của Phan Mạnh Quỳnh với chất lượng 4K tại Lululola Show.	Người yêu thích âm nhạc Việt Nam và fans của Phan Mạnh Quỳnh	Chương trình âm nhạc giới thiệu bài hát nổi bật của Phan Mạnh Quỳnh.	2026-10-22 12:59:35.323
191	116	Những ca khúc nổi tiếng của thế hệ 7x, 8x, 9x	Giải trí	Âm nhạc	Tích cực	["ca khúc", "Phan Đinh Tùng", "Tuấn Hưng", "Lam Trường", "Jimmy Nguyễn"]	Video tổng hợp những ca khúc nổi tiếng từ các ca sĩ thế hệ 7x, 8x, 9x.	Người yêu thích âm nhạc Việt Nam, đặc biệt là các thế hệ 7x, 8x, 9x.	Khám phá những bản hit gắn liền với thanh xuân của nhiều thế hệ.	2026-10-22 12:59:35.338
188	117	Nỗi nhớ và tình yêu đã mất	Giải trí	Âm nhạc	Tiêu cực	["tình yêu", "nỗi nhớ", "khúc hát"]	Bài hát thể hiện nỗi đau và sự hối tiếc của người yêu khi tình cảm nhạt phai.	Người yêu thích âm nhạc buồn và lãng mạn	Dù có mất bao nhiêu thời gian, tình yêu vẫn còn đó trong trái tim.	2026-10-22 12:59:35.323
139	115	Khám phá và khai thác kim cương	Giải trí	Thử nghiệm	Tích cực	["kim cương", "khai thác", "thử thách"]	Video theo dõi cuộc thi kiếm kim cương và người chiến thắng sẽ giữ lại kim cương đó.	Người yêu thích thử thách và trò chơi giải trí	Ai là người đầu tiên khai thác được kim cương sẽ sở hữu nó.	2026-10-22 10:41:52.23
143	111	Xây dựng và khám phá	Giải trí	Hướng dẫn	Tích cực	["xây dựng", "khám phá", "thám hiểm"]	Nội dung video hướng dẫn người xem cách xây dựng và khám phá những địa điểm mới.	Những người yêu thích khám phá và xây dựng	Khuyến khích người xem tham gia vào việc xây dựng và khám phá.	2026-10-22 10:41:52.236
\.


--
-- Data for Name: auth_sessions; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.auth_sessions (sid, sess, expire) FROM stdin;
lUvPOENfUQ9erguKOCPAERw_HsBQ38le	{"cookie":{"originalMaxAge":28800000,"expires":"2026-10-22T20:55:34.409Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"authUser":{"username":"operator","role":"operator"}}	2026-10-22 21:26:36
\.


--
-- Data for Name: competitors; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.competitors (id, name, platform, channel_id, url, created_at) FROM stdin;
11	Diomio	youtube	UCdQIr8t5TG2etJ6GRs5cSHw	https://www.youtube.com/@Diomio-Movie	2026-10-22 01:30:59.177
12	MrBeast	youtube	UCIPPMRA040LQr5QPyJEbmXA	https://www.youtube.com/@MrBeastGaming	2026-10-22 10:38:51.64
13	lululola	youtube	UCs_-IW1S83ky-jZGm1P8L2w	https://www.youtube.com/@LululolaShow	2026-10-22 12:57:09.915
14	Xàm	youtube	UCp2sYIM23EwsHYzKH1yVjZQ	https://www.youtube.com/channel/UCp2sYIM23EwsHYzKH1yVjZQ	2026-10-22 13:25:17.259
\.


--
-- Data for Name: monitoring_alerts; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.monitoring_alerts (id, content_id, competitor_id, platform, alert_type, message, views_change, likes_change, comments_change, views_growth_rate, likes_growth_rate, comments_growth_rate, created_at) FROM stdin;
\.


--
-- Data for Name: performance_analyses; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.performance_analyses (id, competitor_id, platform, video_count, total_views, total_likes, total_comments, total_engagement, average_views, average_likes, average_comments, engagement_rate, average_like_rate, average_comment_rate, performance_rank, created_at, updated_at) FROM stdin;
41	11	youtube	25	2565810	19145	3875	23020	102632.4	765.8	155	0.9	0.89	0.22	2	2026-10-22 01:32:14.89	2026-10-22 12:59:36.739
46	13	youtube	25	1857725	4735	140	4875	74309	189.4	5.6	0.26	0.33	0.03	3	2026-10-22 12:59:36.82	2026-10-22 12:59:36.82
43	12	youtube	25	1296651580	19451340	293245	19744585	51866063.2	778053.6	11729.8	1.52	1.46	0.02	1	2026-10-22 10:45:59.7	2026-10-22 12:59:36.822
\.


--
-- Data for Name: social_contents; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.social_contents (id, competitor_id, platform, content_id, title, description, url, published_at, created_at) FROM stdin;
106	11	youtube	fMtueBArIPA	CHÚNG TA ĐỀU HIỂU SAI DRACO MALFOY	BẤM ĐĂNG KÝ KÊNH ĐỂ KHÔNG BỎ LỠ VIDEO MỚI NHẤT CỦA CHÚNG MÌNH NHA! GHÉ QUA https://techspace.vn/bo-mo-hinh-lego-harry-potter-lau-dai-mini-hogwarts-castle-40975 ĐỂ ỦNG HỘ CHO ĐỘI NGŨ DIOMIO BÁT PHỞ ĂN SÁNG NHÁ! ĐỪNG QUÊN NHẬP MÃ "DIOMIOLEGO" ĐỂ NHẬN ƯU ĐÃI KHI MUA CÁC DÒNG SẢN PHẨM LEGO CHÍNH HÃNG 100%, GIÁ TỐT NHẤT TẠI TECHSPACE VIỆT NAM Đăng ký nếu bạn yêu video về COMIC và PHIM của DIOMIO: https://bit.ly/3SwQ67J Group Khoe Gear để show góc máy: https://www.facebook.com/groups/khoegear/ Kết nối với bọn mình tại group: https://www.facebook.com/groups/diomiogo Tham gia server Discord của chúng mình: https://discord.com/invite/3yzHzq9Ext Host: Andrew Vũ Kịch bản: Shinobi Edit: Andrew Vũ 0:00 - Mở đầu 1:57 - Viên Đớ Phù Thủy 3:44 - Hầm Chứa Loli 5:20 - Ai Rồi Cũng Phải Đi Azkaban Thôi 7:01 - Chiếc Glock Lửa 8:27 - Hội Phượng Hoàng 9:40 - Hoàng Tử Da Nâu 12:32 - Bảo Bối Tử Thần Nè Nobita ---------------------------------------------------------------------------------------------------------- Chào mọi người! Đây là Diomio - Chơi Phim, Hít Truyện. Kênh Youtube được lập ra để giao lưu với các bạn giống như bọn mình, có niềm yêu thích những thứ thuộc về văn hóa Phim Ảnh nói chung! Nếu mọi người cảm thấy thích thì hãy bấm like, share video và subscribe để ủng hộ kênh nha :D --------------------------------------------------------------------------------------- Liên hệ hợp tác: diomiovn@gmail.com #Diomio	https://www.youtube.com/watch?v=fMtueBArIPA	2026-10-19 11:50:50	2026-10-22 01:31:07.555
107	11	youtube	ogxprRE3ziQ	VÌ SAO LEGO CHIMA & NEXO KNIGHT NGỬA D*I TRƯỚC NINJAGO?	BẤM ĐĂNG KÝ KÊNH ĐỂ KHÔNG BỎ LỠ VIDEO MỚI NHẤT CỦA CHÚNG MÌNH NHA! GHÉ QUA https://techspace.vn/lego-ninjago ĐỂ ỦNG HỘ CHO ĐỘI NGŨ DIOMIO BÁT PHỞ ĂN SÁNG NHÁ! ĐỪNG QUÊN NHẬP MÃ "DIOMIOLEGO" ĐỂ NHẬN ƯU ĐÃI KHI MUA CÁC DÒNG SẢN PHẨM LEGO CHÍNH HÃNG 100%, GIÁ TỐT NHẤT TẠI TECHSPACE VIỆT NAM Đăng ký nếu bạn yêu video về COMIC và PHIM của DIOMIO: https://bit.ly/3SwQ67J Group Khoe Gear để show góc máy: https://www.facebook.com/groups/khoegear/ Kết nối với bọn mình tại group: https://www.facebook.com/groups/diomiogo Tham gia server Discord của chúng mình: https://discord.com/invite/3yzHzq9Ext Host: Andrew Vũ Kịch bản: Shinobi Edit: Andrew Vũ ---------------------------------------------------------------------------------------------------------- Chào mọi người! Đây là Diomio - Chơi Phim, Hít Truyện. Kênh Youtube được lập ra để giao lưu với các bạn giống như bọn mình, có niềm yêu thích những thứ thuộc về văn hóa Phim Ảnh nói chung! Nếu mọi người cảm thấy thích thì hãy bấm like, share video và subscribe để ủng hộ kênh nha :D --------------------------------------------------------------------------------------- Liên hệ hợp tác: diomiovn@gmail.com #Diomio	https://www.youtube.com/watch?v=ogxprRE3ziQ	2026-10-14 11:30:22	2026-10-22 01:31:07.577
120	13	youtube	wvNS7q269Zk	Có Chàng Trai Viết Lên Cây - Phan Mạnh Quỳnh (Bản Đẹp 4K) | Lululola Show	Có Chàng Trai Viết Lên Cây - Phan Mạnh Quỳnh (Bản Đẹp 4K) | Lululola Show #cochangtraivietlencay #phanmanhquynh ============================== Lululola Coffee+ Theo dõi lịch show ca sĩ: https://facebook.com/lululolacoffee Đặt vé show: https://lululola.com.vn ☎️ Hotline: 0969998966 ☕ Địa chỉ: Đầu đèo Prenn, đường 3/4, đồi Cà Ri Dê, Phường 3, TP. Đà Lạt #LululolaCoffee #DaLat #Coffee	https://www.youtube.com/watch?v=wvNS7q269Zk	2026-05-04 10:07:31	2026-10-22 12:57:20.211
108	11	youtube	PlQKdW1e8u0	ANH NÀY TỪNG BỊ DARKSEID ĐẤM KHÔNG TRƯỢT PHÁT NÀO.	BẤM ĐĂNG KÝ KÊNH ĐỂ KHÔNG BỎ LỠ VIDEO MỚI NHẤT CỦA CHÚNG MÌNH NHA! GHÉ QUA https://techspace.vn/lego ĐỂ ỦNG HỘ CHO ĐỘI NGŨ DIOMIO BÁT PHỞ ĂN SÁNG NHÁ! ĐỪNG QUÊN NHẬP MÃ "DIOMIOLEGO" ĐỂ NHẬN ƯU ĐÃI KHI MUA CÁC DÒNG SẢN PHẨM LEGO CHÍNH HÃNG 100%, GIÁ TỐT NHẤT TẠI TECHSPACE VIỆT NAM: https://techspace.vn/lego Đăng ký nếu bạn yêu video về COMIC và PHIM của DIOMIO: https://bit.ly/3SwQ67J Group Khoe Gear để show góc máy: https://www.facebook.com/groups/khoegear/ Kết nối với bọn mình tại group: https://www.facebook.com/groups/diomiogo Tham gia server Discord của chúng mình: https://discord.com/invite/3yzHzq9Ext Host: Andrew Vũ Kịch bản: Shinbobi Edit: Andrew Vũ 0:00 - Mở đầu 1:03 - PHIM ĐẦU TIÊN CỦA DCEU 3:41 - GREEN LANTERN ĐẦU TIÊN CỦA TRÁI ĐẤT 5:28 - GREEN LANTERN TỪ NƠI ĐỒNG XANH... 6:05 - GREEN LANTERN XÃ HỘI CHỦ NGHĨA 7:54 - SỨC MẠNH CỦA GREEN LANTERN 9:35 - ĐIỂM YẾU CỦA GREEN LANTERN 10:05 - NGUYÊN TẮC GREEN LANTERN 12:15 - SINH RA TỪ SỰ SAI LẦM 13:42 - KHỦNG HOẢNG GREEN LANTERN 15:46 - THẦN ÁNH SÁNG GREEN LANTERN ---------------------------------------------------------------------------------------------------------- Chào mọi người! Đây là Diomio - Chơi Phim, Hít Truyện. Kênh Youtube được lập ra để giao lưu với các bạn giống như bọn mình, có niềm yêu thích những thứ thuộc về văn hóa Phim Ảnh nói chung! Nếu mọi người cảm thấy thích thì hãy bấm like, share video và subscribe để ủng hộ kênh nha :D --------------------------------------------------------------------------------------- Liên hệ hợp tác: diomiovn@gmail.com #Diomio	https://www.youtube.com/watch?v=PlQKdW1e8u0	2026-10-09 11:44:00	2026-10-22 01:31:07.577
110	11	youtube	R4aeUDg1HYY	CẠP VS ỈON MÂN - LÝ TƯỞNG AI MỚI ĐÚNG?	BẤM ĐĂNG KÝ KÊNH ĐỂ KHÔNG BỎ LỠ VIDEO MỚI NHẤT CỦA CHÚNG MÌNH NHA! GHÉ QUA https://techspace.vn/lego ĐỂ ỦNG HỘ CHO ĐỘI NGŨ DIOMIO BÁT PHỞ ĂN SÁNG NHÁ! ĐỪNG QUÊN NHẬP MÃ "DIOMIOLEGO" ĐỂ NHẬN ƯU ĐÃI KHI MUA CÁC DÒNG SẢN PHẨM LEGO CHÍNH HÃNG 100%, GIÁ TỐT NHẤT TẠI TECHSPACE VIỆT NAM: https://techspace.vn/lego Đăng ký nếu bạn yêu video về COMIC và PHIM của DIOMIO: https://bit.ly/3SwQ67J Group Khoe Gear để show góc máy: https://www.facebook.com/groups/khoegear/ Kết nối với bọn mình tại group: https://www.facebook.com/groups/diomiogo Tham gia server Discord của chúng mình: https://discord.com/invite/3yzHzq9Ext Host: Andrew Vũ Kịch bản: Shinobi Edit: Andrew Vũ ---------------------------------------------------------------------------------------------------------- Chào mọi người! Đây là Diomio - Chơi Phim, Hít Truyện. Kênh Youtube được lập ra để giao lưu với các bạn giống như bọn mình, có niềm yêu thích những thứ thuộc về văn hóa Phim Ảnh nói chung! Nếu mọi người cảm thấy thích thì hãy bấm like, share video và subscribe để ủng hộ kênh nha :D --------------------------------------------------------------------------------------- Liên hệ hợp tác: diomiovn@gmail.com #Diomio	https://www.youtube.com/watch?v=R4aeUDg1HYY	2026-09-17 12:23:31	2026-10-22 01:31:07.588
113	12	youtube	h8VE9_aHd94	$10,000 Every Day You Survive In Minecraft	I trapped my friend in a room to see how good he can get at Minecraft Buy Feastables for Halloween! We could knock on your door Halloween night with $10,000 👀 https://www.amazon.com/stores/page/B8E6FC90-F1F2-4E97-A1B0-13138D39F8F3?maas=maas_adg_242DDE22ECF76D01B923DAF8F0B2AB11_afap_abs&ref_=aa_maas&tag=maas NoPurchNecessary. Ends 10/28/26@1:59pmET. Open to US/DC, must be 18+. Rules apply https://fst.gg/hwn-rules New Merch - https://mrbeast.store Join our discord server for your chance to compete in future Minecraft challenges! https://discord.gg/mrbeastgaming Original Score by Jules Werli Music Provided by https://www.extrememusic.com ---------------------------------------------------------------- follow all of these or i will kick you • Facebook - https://www.facebook.com/MrBeast/ • Twitter - https://twitter.com/MrBeast • Instagram - https://www.instagram.com/mrbeast	https://www.youtube.com/watch?v=h8VE9_aHd94	2026-10-10 16:00:02	2026-10-22 10:39:08.419
115	12	youtube	3yEnPrLt8e4	First To Mine A Diamond, Keeps It!		https://www.youtube.com/watch?v=3yEnPrLt8e4	2026-10-01 16:00:00	2026-10-22 10:39:08.48
109	11	youtube	rpm-EM_y7_c	HAIRY PÓTTƠ MỚI NÀY HƠI MÙI..........	BẤM ĐĂNG KÝ KÊNH ĐỂ KHÔNG BỎ LỠ VIDEO MỚI NHẤT CỦA CHÚNG MÌNH NHA! GHÉ QUA https://techspace.vn/lego ĐỂ ỦNG HỘ CHO ĐỘI NGŨ DIOMIO BÁT PHỞ ĂN SÁNG NHÁ! ĐỪNG QUÊN NHẬP MÃ "DIOMIOLEGO" ĐỂ NHẬN ƯU ĐÃI KHI MUA CÁC DÒNG SẢN PHẨM LEGO CHÍNH HÃNG 100%, GIÁ TỐT NHẤT TẠI TECHSPACE VIỆT NAM: https://techspace.vn/lego Đăng ký nếu bạn yêu video về COMIC và PHIM của DIOMIO: https://bit.ly/3SwQ67J Group Khoe Gear để show góc máy: https://www.facebook.com/groups/khoegear/ Kết nối với bọn mình tại group: https://www.facebook.com/groups/diomiogo Tham gia server Discord của chúng mình: https://discord.com/invite/3yzHzq9Ext Host: Andrew Vũ Kịch bản: Minh Solid Edit: Andrew Vũ ---------------------------------------------------------------------------------------------------------- Chào mọi người! Đây là Diomio - Chơi Phim, Hít Truyện. Kênh Youtube được lập ra để giao lưu với các bạn giống như bọn mình, có niềm yêu thích những thứ thuộc về văn hóa Phim Ảnh nói chung! Nếu mọi người cảm thấy thích thì hãy bấm like, share video và subscribe để ủng hộ kênh nha :D --------------------------------------------------------------------------------------- Liên hệ hợp tác: diomiovn@gmail.com #Diomio	https://www.youtube.com/watch?v=rpm-EM_y7_c	2026-10-01 11:22:11	2026-10-22 01:31:07.587
116	13	youtube	06Q_XyJe9O4	Những Ca Khúc Nổi Tiếng Thế Hệ 7x 8x 9x - Phan Đinh Tùng, Tuấn Hưng, Lam Trường, Jimmy Nguyễn...	Những Ca Khúc Nổi Tiếng Thế Hệ 7x 8x 9x - Phan Đinh Tùng, Tuấn Hưng, Lam Trường, Jimmy Nguyễn... #phandinhtung #tuanhung #lamtruong #jimmynguyen Timestamps: 00:00:00 Cạm Bẫy Tình Yêu - Phan Đinh Tùng 00:04:24 Tìm Lại Bầu Trời - Tuấn Hưng 00:10:02 Lãng Quên Chiều Thu - Lam Trường 00:14:21 Quên Cách Yêu - Lương Bích Hữu 00:18:44 Cào Cào Lá Tre - Phan Đinh Tùng 00:23:21 Tình Đơn Phương - Lam Trường 00:29:06 Cầu Vồng Khuyết - Tuấn Hưng 00:33:30 Vĩnh Biệt Màu Xanh - Jimmii Nguyễn 00:37:11 Với Anh Em Vẫn Là Cô Bé - Lương Bích Hữu & Hoàng Hải 00:41:42 Hãy Về Đây Bên Anh - Tuấn Hưng 00:45:46 Nhớ Về Em - Jimmii Nguyễn 00:52:36 Quên - Khởi My 00:56:34 Ngồi Bên Em - Phan Đinh Tùng 01:01:01 Tình Như Lá Bay Xa - Lương Bích Hữu 01:04:45 Dằm Trong Tim - Lương Bích Hữu 01:09:13 Vì Sao - Khởi My 01:12:46 Cô Gái Trung Hoa - Lương Bích Hữu 01:16:58 Mưa Phi Trường - Lam Trường 01:21:16 Hoa Bằng Lăng - Jimmii Nguyễn 01:25:43 Ánh Trăng Nói Hộ Lòng Tôi - Lương Bích Hữu & Hoàng Hải ============================== Lululola Coffee+ Theo dõi lịch show ca sĩ: https://facebook.com/lululolacoffee Đặt vé show: https://lululola.com.vn ☎️ Hotline: 0969998966 ☕ Địa chỉ: Đầu đèo Prenn, đường 3/4, đồi Cà Ri Dê, Phường 3, TP. Đà Lạt #LululolaCoffee #DaLat #Coffee	https://www.youtube.com/watch?v=06Q_XyJe9O4	2026-05-13 09:30:14	2026-10-22 12:57:20.094
119	13	youtube	RPgni4-T34A	MỘT NGÀY HAY TRĂM NĂM - VĂN MAI HƯƠNG (PHỐI MỚI 2026) | Lululola Show	MỘT NGÀY HAY TRĂM NĂM - VĂN MAI HƯƠNG (PHỐI MỚI 2026) | Lululola Show #motngayhaytramnam #vanmaihuong ============================== Lululola Coffee+ Theo dõi lịch show ca sĩ: https://facebook.com/lululolacoffee Đặt vé show: https://lululola.com.vn ☎️ Hotline: 0969998966 ☕ Địa chỉ: Đầu đèo Prenn, đường 3/4, đồi Cà Ri Dê, Phường 3, TP. Đà Lạt #LululolaCoffee #DaLat #Coffee	https://www.youtube.com/watch?v=RPgni4-T34A	2026-05-08 10:17:25	2026-10-22 12:57:20.212
111	12	youtube	SxNn1AjvMzM	Build It, Go There!		https://www.youtube.com/watch?v=SxNn1AjvMzM	2026-10-15 16:00:02	2026-10-22 10:39:08.415
114	12	youtube	PyLGTmWz37U	I Found My 13 Year Old Minecraft World	I finally made the Minecraft world I always wanted to make, 13 years later Check out our new MrBeast Lab MEGA Mutators at Walmart! 👉 https://www.walmart.com/ip/MEGA-PNTHR/19203372461?classType=REGULAR The laptop I originally used to record the first episodes was destroyed, so we used the original seed and painstakingly recreated every block to make it the exact same that I had 13 years ago. If you want to play on this world, download it here: https://drive.google.com/file/d/1ODgKBHIXMKU9v2IZiedkppHA6m95ze6G/view?usp=sharing New Merch - https://mrbeast.store Join our discord server for your chance to compete in future Minecraft challenges! https://discord.gg/mrbeastgaming Original Score by Jules Werli Music Provided by https://www.extrememusic.com ---------------------------------------------------------------- follow all of these or i will kick you • Facebook - https://www.facebook.com/MrBeast/ • Twitter - https://twitter.com/MrBeast • Instagram - https://www.instagram.com/mrbeast	https://www.youtube.com/watch?v=PyLGTmWz37U	2026-09-26 16:00:04	2026-10-22 10:39:08.48
117	13	youtube	B_5X6kGn2B8	DÙ MẤT BAO NHIỀU THỜI GIAN - SONG LUÂN (NEW VERSION) | Lululola Show	DÙ MẤT BAO NHIỀU THỜI GIAN - SONG LUÂN (NEW VERSION) | Lululola Show Sáng tác: Phúc Trường #dumatbaonhieuthoigian #songluan Lyrics: Tình giờ tan vỡ, mộng giờ đã lỡ Phải chăng vì anh hững hờ Rồi em vội quay lưng đi Chẳng câu chia ly, tiếc nuối cũng không còn gì. Để rồi anh biết muộn màng hối tiếc Đã không mang em trở về Còn đâu nụ hôn mê say mình tay trong tay Chỉ mỗi riêng anh hiu quạnh. [ĐK:] Dù mất bao nhiêu thời anh vẫn yêu, vẫn chờ đợi Dù biết em đã đổi thay nhưng trong anh vẫn từng ngày Tìm kiếm một vòng tay ngày đó yêu nồng say Đừng để con tim anh chơi vơi trong lúc này. Dù có phôi phai ngày sau anh vẫn nguyên vẹn cuộc tình Dù bóng đêm giờ đây vây quanh anh chỉ một mình Lạc lõng trong màn đêm tìm hơi ấm của đôi ta Có lẽ yêu thương trong em đã tàn, mình anh với đêm. ============================== Lululola Coffee+ Theo dõi lịch show ca sĩ: https://facebook.com/lululolacoffee Đặt vé show: https://lululola.com.vn ☎️ Hotline: 0969998966 ☕ Địa chỉ: Đầu đèo Prenn, đường 3/4, đồi Cà Ri Dê, Phường 3, TP. Đà Lạt #LululolaCoffee #DaLat #Coffee	https://www.youtube.com/watch?v=B_5X6kGn2B8	2026-04-17 02:30:07	2026-10-22 12:57:20.21
121	14	youtube	vY41frQ6LYc	Người Tiền Sử Có Sợ Bóng Tối?	Người tiền sử có sợ bóng tối không? Khi màn đêm buông xuống, không có đèn điện, đèn pin hay bất kỳ thiết bị chiếu sáng hiện đại nào, tổ tiên chúng ta đã đối mặt với bóng tối và những mối nguy hiểm như thế nào? Từ tiếng động bí ẩn trong rừng sâu, những loài thú săn mồi hoạt động ban đêm đến nỗi lo khi ngọn lửa cuối cùng tắt đi, cuộc sống thời tiền sử đặt ra những thử thách sinh tồn không hề đơn giản. Nhưng liệu người tiền sử thực sự sợ bóng tối, hay họ đã tìm ra cách thích nghi với thế giới đầy bất trắc ấy? Trong video này, chúng ta sẽ khám phá những bằng chứng khảo cổ thú vị từ hang Bruniquel, Wonderwerk và Atxurra, tìm hiểu cách người Neanderthal cùng tổ tiên loài người sử dụng lửa, đuốc và đèn mỡ động vật để chinh phục những không gian tối tăm. Đồng thời, khám phá vai trò của bản năng sinh tồn, tâm lý sợ hãi, giấc ngủ và sự hợp tác trong cộng đồng người cổ đại. Qua đó, bạn sẽ hiểu vì sao bóng tối không chỉ là một nỗi sợ, mà còn là thử thách góp phần định hình khả năng thích nghi và phát triển của con người. #NguoiTienSu #SoBongToi #ThoiTienSu #KhaoCoHoc #LichSuLoaiNguoi	https://www.youtube.com/watch?v=vY41frQ6LYc	2026-10-20 11:19:19	2026-10-22 13:25:38.909
124	14	youtube	CoiEMCXrtvg	Vì Sao Người Tiền Sử Bỏ Lại Con Mồi Mới Săn Được?	Vì sao người tiền sử lại bỏ lại con mồi sau khi đã tốn bao nhiêu công sức săn bắt? Trong thế giới tiền sử đầy nguy hiểm, mỗi miếng thịt đều có giá trị sống còn. Thế nhưng, những phát hiện khảo cổ tại Schöningen ở Đức và Kanjera South ở Kenya cho thấy người cổ đại không phải lúc nào cũng tận dụng toàn bộ con vật đã săn được. Từ những chiếc xương chưa bị đập vỡ đến dấu vết cắt xẻ bằng công cụ đá, các nhà khoa học đang dần hé lộ những quyết định sinh tồn đầy bất ngờ của tổ tiên chúng ta. Trong video này, chúng ta sẽ khám phá lý do người tiền sử đôi khi từ bỏ cuộc săn, bỏ lại thịt và xương động vật, cũng như cách họ lựa chọn những phần có giá trị nhất của con mồi. Liệu nguyên nhân đến từ những loài thú săn mồi nguy hiểm, giới hạn sức lực, khó khăn vận chuyển hay một chiến lược sinh tồn thông minh? Hãy cùng quay ngược thời gian để tìm hiểu cuộc sống thời tiền sử, những bí mật khảo cổ và cách con người cổ đại đưa ra quyết định để tồn tại trong một thế giới khắc nghiệt. #NguoiTienSu #ConNguoiCoDai #SinhTonTienSu #KhaoCoHoc #LichSuTienSu	https://www.youtube.com/watch?v=CoiEMCXrtvg	2026-10-21 13:12:57	2026-10-22 13:25:38.943
112	12	youtube	nM21hVqvhmk	If You Escape, You Win $1,000,000	I had 10 teams fight in Call of Duty’s new DMZ mode for $1,000,000 DMZ Early Access starts Oct 20. Pre-order Call of Duty: Modern Warfare 4 to jump in. Watching in a dubbed language? The full lineup with our typical voices drops Friday, October 23rd (ET). Enjoy the video! New Merch - https://mrbeast.store Join our discord server for your chance to compete in future Minecraft challenges! https://discord.gg/mrbeastgaming Original Score by Jules Werli Music Provided by https://www.extrememusic.com ---------------------------------------------------------------- follow all of these or i will kick you • Facebook - https://www.facebook.com/MrBeast/ • Twitter - https://twitter.com/MrBeast • Instagram - https://www.instagram.com/mrbeast	https://www.youtube.com/watch?v=nM21hVqvhmk	2026-10-19 16:00:00	2026-10-22 10:39:08.41
118	13	youtube	RJXbae_eS4o	NGÀY CHƯA GIÔNG BÃO - SONG LUÂN | Lululola Show	NGÀY CHƯA GIÔNG BÃO - SONG LUÂN | Lululola Show Sáng tác: Phan Mạnh Quỳnh Vẫn là những ca từ đậm chất thơ của Phan Mạnh Quỳnh, nhưng qua giọng hát trầm ấm của Song Luân, bài hát mang một nỗi buồn rất khác: tĩnh lặng, sâu sắc và đầy day dứt. Đôi khi bình yên nhất lại là khoảnh khắc ngay trước khi giông bão ập tới... #ngaychuagiongbao #songluan #phanmanhquynh ============================== Lululola Coffee+ Theo dõi lịch show ca sĩ: https://facebook.com/lululolacoffee Đặt vé show: https://lululola.com.vn ☎️ Hotline: 0969998966 ☕ Địa chỉ: Đầu đèo Prenn, đường 3/4, đồi Cà Ri Dê, Phường 3, TP. Đà Lạt #LululolaCoffee #DaLat #Coffee	https://www.youtube.com/watch?v=RJXbae_eS4o	2026-04-16 02:30:20	2026-10-22 12:57:20.211
122	14	youtube	CrvAGcRG4KU	Vì Sao Tổ Tiên Chúng Ta Mất Đi Bộ Lông Rậm Rạp?	Vì sao tổ tiên chúng ta từng sở hữu bộ lông dày giống những loài linh trưởng khác, nhưng con người hiện đại lại có làn da gần như không còn lông? Phải chăng khí hậu nóng bức ở châu Phi đã khiến tổ tiên loài người dần đánh mất lớp lông bảo vệ? Trong video này, chúng ta sẽ quay ngược hàng triệu năm tiến hóa để khám phá mối liên hệ giữa bộ lông, tuyến mồ hôi, khả năng điều hòa thân nhiệt và cuộc sống sinh tồn của người tiền sử. Điều bất ngờ là con người thực sự chưa từng mất hết lông trên cơ thể. Đằng sau vẻ ngoài tưởng chừng đơn giản ấy là một quá trình tiến hóa phức tạp, liên quan đến di truyền, môi trường, khả năng vận động và những đánh đổi sinh học. Tại sao con người vẫn giữ tóc trên đầu? Tại sao chúng ta đổ nhiều mồ hôi hơn các loài linh trưởng khác? Và liệu việc mất bộ lông dày có thực sự giúp tổ tiên chúng ta sống sót tốt hơn? Hãy cùng khám phá một trong những bí ẩn thú vị nhất về nguồn gốc cơ thể con người. #NguoiTienSu #TienHoaLoaiNguoi #ToTienLoaiNguoi #LichSuTienSu #KhamPhaKhoaHoc	https://www.youtube.com/watch?v=CrvAGcRG4KU	2026-10-22 11:15:24	2026-10-22 13:25:38.918
123	14	youtube	HGMzvco7CMw	Vì Sao Có Lửa Người Tiền Sử Vẫn Chết Rét?	Tại sao người tiền sử đã biết sử dụng lửa nhưng vẫn có nguy cơ chết rét giữa những đêm lạnh giá? Một đống lửa đang cháy không có nghĩa cơ thể sẽ được giữ ấm suốt đêm. Gió lạnh, mưa ẩm, nền đất buốt giá và sự thiếu hụt năng lượng đều có thể khiến con người mất nhiệt nhanh hơn khả năng tự sưởi ấm. Trong video này, chúng ta sẽ khám phá những nguy hiểm mà người tiền sử phải đối mặt, lý do ngọn lửa không thể bảo vệ họ hoàn toàn và những bí mật sinh tồn ít ai ngờ tới. Thông qua các bằng chứng khảo cổ tại Abric Romaní và Border Cave, chúng ta sẽ tìm hiểu cách người Neanderthal và những cộng đồng người cổ đại sử dụng lửa, tìm nơi trú ẩn, chuẩn bị chỗ ngủ, tận dụng da thú và vật liệu tự nhiên để chống chọi với thời tiết khắc nghiệt. Từ hiện tượng hạ thân nhiệt đến những kỹ năng giữ ấm tưởng chừng đơn giản, câu chuyện cho thấy để sống sót qua một đêm lạnh, tổ tiên chúng ta cần nhiều hơn một đống lửa. Vậy điều gì thực sự giúp người tiền sử vượt qua cái rét và tiếp tục tồn tại qua hàng nghìn thế hệ? #NguoiTienSu #ThoiTienSu #SinhTonTienSu #NguoiNeanderthal #KhamPhaLichSu	https://www.youtube.com/watch?v=HGMzvco7CMw	2026-10-19 12:07:55	2026-10-22 13:25:38.928
125	14	youtube	ROYED70fDmU	Vì Sao Người Tiền Sử Có Thể Sinh Sống Gần Những Loài Động Vật Nguy Hiểm?	Người tiền sử đã sinh sống như thế nào giữa những loài động vật nguy hiểm như sư tử hang động, linh cẩu, gấu và các loài thú săn mồi khổng lồ? Khi chưa có nhà cửa kiên cố hay vũ khí hiện đại, làm sao tổ tiên chúng ta có thể tìm kiếm thức ăn, nước uống và nơi trú ẩn mà không liên tục trở thành con mồi? Khám phá những chiến lược sinh tồn đáng kinh ngạc của người Neanderthal và các nhóm người cổ trong thế giới tiền sử đầy hiểm nguy. Trong video này, chúng ta sẽ khám phá các bằng chứng khảo cổ tại hang Teixoneres, Olduvai, Schöningen và Siegsdorf để hiểu cách người tiền sử sử dụng công cụ, hợp tác theo nhóm, kiểm soát lửa và tránh những cuộc đối đầu không cần thiết. Từ việc tranh giành hang động với thú dữ đến khả năng săn cả sư tử hang động, câu chuyện sẽ hé lộ vì sao trí thông minh, kinh nghiệm và khả năng thích nghi đã giúp tổ tiên loài người tồn tại qua hàng nghìn thế hệ. #NguoiTienSu #SinhTonThoiTienSu #DongVatTienSu #NguoiNeanderthal #KhamPhaLichSu	https://www.youtube.com/watch?v=ROYED70fDmU	2026-10-18 11:46:59	2026-10-22 13:25:38.949
\.


--
-- Data for Name: social_metrics; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.social_metrics (id, content_id, views, likes, comments, shares, captured_at) FROM stdin;
343	108	53540	463	84	\N	2026-10-22 10:39:07.335
342	115	62334640	1130391	3821	\N	2026-10-22 10:39:07.335
363	108	53546	463	84	\N	2026-10-22 12:45:05.145
365	109	79311	758	174	\N	2026-10-22 12:45:05.145
367	115	62406917	1131213	3823	\N	2026-10-22 12:45:05.145
369	113	61276797	738057	19824	\N	2026-10-22 12:45:05.145
399	115	62456037	1131453	3823	\N	2026-10-22 13:18:23.294
401	113	61321648	738355	19827	\N	2026-10-22 13:18:23.294
403	118	3425	19	3	\N	2026-10-22 13:18:23.294
406	120	146590	135	3	\N	2026-10-22 13:18:23.294
408	110	63779	758	353	\N	2026-10-22 13:18:23.294
344	114	48998209	682720	20763	\N	2026-10-22 10:39:07.335
345	112	36714080	286310	9010	\N	2026-10-22 10:39:07.335
347	106	77067	787	101	\N	2026-10-22 10:39:07.335
349	113	61205189	737181	19810	\N	2026-10-22 10:39:07.335
371	107	238989	1067	63	\N	2026-10-22 12:47:54.217
374	112	37296910	287904	9049	\N	2026-10-22 12:47:54.217
404	119	18125	67	3	\N	2026-10-22 13:18:23.294
405	111	49292150	1050222	5165	\N	2026-10-22 13:18:23.294
341	110	63779	758	353	\N	2026-10-22 10:39:07.335
346	109	79311	758	174	\N	2026-10-22 10:39:07.335
348	107	238114	1062	63	\N	2026-10-22 10:39:07.335
350	111	49125320	1046924	5158	\N	2026-10-22 10:39:07.335
372	108	53546	463	84	\N	2026-10-22 12:47:54.217
376	109	79311	758	174	\N	2026-10-22 12:47:54.217
378	111	49249806	1049530	5162	\N	2026-10-22 12:47:54.217
380	114	49026337	683060	20787	\N	2026-10-22 12:47:54.217
410	116	197862	710	17	\N	2026-10-22 13:18:23.294
351	106	77086	787	101	\N	2026-10-22 10:44:47.216
353	108	53540	463	84	\N	2026-10-22 10:44:47.216
358	109	79311	758	174	\N	2026-10-22 10:44:47.216
373	113	61280106	738081	19824	\N	2026-10-22 12:47:54.217
375	115	62410497	1131237	3823	\N	2026-10-22 12:47:54.217
377	110	63779	758	353	\N	2026-10-22 12:47:54.217
379	106	77415	782	101	\N	2026-10-22 12:47:54.217
411	116	197910	710	17	\N	2026-10-22 13:25:37.907
416	114	49048341	683170	20792	\N	2026-10-22 13:25:37.907
423	121	4221	11	2	\N	2026-10-22 13:25:37.908
336	108	53505	464	84	\N	2026-10-22 01:31:06.517
337	110	63764	758	353	\N	2026-10-22 01:31:06.517
339	109	79252	757	174	\N	2026-10-22 01:31:06.517
352	110	63779	758	353	\N	2026-10-22 10:44:47.216
354	107	238181	1062	63	\N	2026-10-22 10:44:47.216
356	113	61207820	737219	19813	\N	2026-10-22 10:44:47.216
381	109	79314	758	174	\N	2026-10-22 12:57:18.93
382	114	49028042	683090	20788	\N	2026-10-22 12:57:18.93
384	113	61284779	738142	19825	\N	2026-10-22 12:57:18.93
391	118	3427	19	3	\N	2026-10-22 12:57:18.93
412	109	79311	758	174	\N	2026-10-22 13:25:37.907
417	122	13	0	0	\N	2026-10-22 13:25:37.907
419	119	18125	67	3	\N	2026-10-22 13:25:37.907
421	115	62464216	1131505	3823	\N	2026-10-22 13:25:37.907
425	124	3151	13	1	\N	2026-10-22 13:25:37.907
430	106	77650	781	101	\N	2026-10-22 13:25:37.907
338	107	233064	1055	63	\N	2026-10-22 01:31:06.517
355	112	36734198	286386	9011	\N	2026-10-22 10:44:47.216
357	115	62337662	1130432	3821	\N	2026-10-22 10:44:47.216
383	117	5553	16	2	\N	2026-10-22 12:57:18.93
385	106	77441	782	101	\N	2026-10-22 12:57:18.93
387	108	53540	463	84	\N	2026-10-22 12:57:18.93
390	111	49264398	1049699	5162	\N	2026-10-22 12:57:18.93
392	107	239088	1068	63	\N	2026-10-22 12:57:18.93
413	113	61336431	738426	19828	\N	2026-10-22 13:25:37.907
414	120	146590	135	3	\N	2026-10-22 13:25:37.907
415	112	37604473	288458	9057	\N	2026-10-22 13:25:37.907
424	111	49363171	1050442	5166	\N	2026-10-22 13:25:37.907
429	118	3425	19	3	\N	2026-10-22 13:25:37.907
340	106	75397	781	100	\N	2026-10-22 01:31:06.517
359	111	49128617	1047024	5158	\N	2026-10-22 10:44:47.216
386	112	37334706	288038	9051	\N	2026-10-22 12:57:18.93
388	116	197850	710	17	\N	2026-10-22 12:57:18.93
389	115	62418391	1131299	3823	\N	2026-10-22 12:57:18.93
393	119	18125	67	3	\N	2026-10-22 12:57:18.93
418	125	6799	17	3	\N	2026-10-22 13:25:37.908
420	123	13119	44	3	\N	2026-10-22 13:25:37.908
422	117	5553	16	2	\N	2026-10-22 13:25:37.907
360	114	48999186	682734	20764	\N	2026-10-22 10:44:47.216
394	110	63779	758	353	\N	2026-10-22 12:57:18.93
426	108	53546	463	84	\N	2026-10-22 13:25:37.907
428	110	63797	758	353	\N	2026-10-22 13:25:37.907
361	111	49242515	1049480	5162	\N	2026-10-22 12:45:05.145
366	110	63779	758	353	\N	2026-10-22 12:45:05.145
368	112	37293620	287881	9048	\N	2026-10-22 12:45:05.145
395	120	146590	135	3	\N	2026-10-22 12:57:18.93
427	107	239632	1069	63	\N	2026-10-22 13:25:37.907
362	107	238989	1065	63	\N	2026-10-22 12:45:05.145
364	114	49025025	683052	20784	\N	2026-10-22 12:45:05.145
370	106	77391	782	101	\N	2026-10-22 12:45:05.145
396	107	239230	1069	63	\N	2026-10-22 13:18:23.294
397	109	79311	758	174	\N	2026-10-22 13:18:23.294
398	108	53546	463	84	\N	2026-10-22 13:18:23.294
400	117	5553	16	2	\N	2026-10-22 13:18:23.294
402	114	49046003	683148	20790	\N	2026-10-22 13:18:23.294
407	106	77501	781	101	\N	2026-10-22 13:18:23.294
409	112	37533787	288347	9056	\N	2026-10-22 13:18:23.294
\.


--
-- Name: ai_analyses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.ai_analyses_id_seq', 266, true);


--
-- Name: competitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.competitors_id_seq', 14, true);


--
-- Name: monitoring_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.monitoring_alerts_id_seq', 21, true);


--
-- Name: performance_analyses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.performance_analyses_id_seq', 47, true);


--
-- Name: social_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.social_contents_id_seq', 125, true);


--
-- Name: social_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public.social_metrics_id_seq', 430, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ai_analyses ai_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.ai_analyses
    ADD CONSTRAINT ai_analyses_pkey PRIMARY KEY (id);


--
-- Name: competitors competitors_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.competitors
    ADD CONSTRAINT competitors_pkey PRIMARY KEY (id);


--
-- Name: monitoring_alerts monitoring_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.monitoring_alerts
    ADD CONSTRAINT monitoring_alerts_pkey PRIMARY KEY (id);


--
-- Name: performance_analyses performance_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performance_analyses
    ADD CONSTRAINT performance_analyses_pkey PRIMARY KEY (id);


--
-- Name: auth_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: social_contents social_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_contents
    ADD CONSTRAINT social_contents_pkey PRIMARY KEY (id);


--
-- Name: social_metrics social_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_metrics
    ADD CONSTRAINT social_metrics_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX "IDX_session_expire" ON public.auth_sessions USING btree (expire);


--
-- Name: ai_analyses_content_id_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX ai_analyses_content_id_key ON public.ai_analyses USING btree (content_id);


--
-- Name: competitors_platform_channel_id_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX competitors_platform_channel_id_key ON public.competitors USING btree (platform, channel_id);


--
-- Name: monitoring_alerts_competitor_id_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX monitoring_alerts_competitor_id_idx ON public.monitoring_alerts USING btree (competitor_id);


--
-- Name: monitoring_alerts_content_id_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX monitoring_alerts_content_id_idx ON public.monitoring_alerts USING btree (content_id);


--
-- Name: performance_analyses_competitor_id_platform_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX performance_analyses_competitor_id_platform_key ON public.performance_analyses USING btree (competitor_id, platform);


--
-- Name: social_contents_platform_content_id_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX social_contents_platform_content_id_key ON public.social_contents USING btree (platform, content_id);


--
-- Name: social_metrics_captured_at_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX social_metrics_captured_at_idx ON public.social_metrics USING btree (captured_at);


--
-- Name: social_metrics_content_id_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX social_metrics_content_id_idx ON public.social_metrics USING btree (content_id);


--
-- Name: ai_analyses ai_analyses_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.ai_analyses
    ADD CONSTRAINT ai_analyses_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.social_contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: monitoring_alerts monitoring_alerts_competitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.monitoring_alerts
    ADD CONSTRAINT monitoring_alerts_competitor_id_fkey FOREIGN KEY (competitor_id) REFERENCES public.competitors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: monitoring_alerts monitoring_alerts_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.monitoring_alerts
    ADD CONSTRAINT monitoring_alerts_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.social_contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_analyses performance_analyses_competitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.performance_analyses
    ADD CONSTRAINT performance_analyses_competitor_id_fkey FOREIGN KEY (competitor_id) REFERENCES public.competitors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: social_contents social_contents_competitor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_contents
    ADD CONSTRAINT social_contents_competitor_id_fkey FOREIGN KEY (competitor_id) REFERENCES public.competitors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: social_metrics social_metrics_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.social_metrics
    ADD CONSTRAINT social_metrics_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.social_contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 4UV48p9Ndzu9I5TWbhC7LhDXfLwy5XbW7gYbf1F0keykcKafH9KglrZXxcptyei

