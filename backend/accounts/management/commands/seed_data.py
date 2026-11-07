from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Institution, StudentProfile
from services.models import Category, ServiceListing

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds initial categories, top 100 Nigerian universities, and rich demo student marketplace data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("🌱 Starting CampusSkills Data Seeding..."))

        # -------------------------------------------------------------
        # 1. SEED MARKETPLACE CATEGORIES
        # -------------------------------------------------------------
        categories = [
            {"name": "Graphic Design", "slug": "graphic-design", "icon_name": "palette"},
            {"name": "Programming & Tech", "slug": "programming-tech", "icon_name": "code"},
            {"name": "Academics & Tutoring", "slug": "academics-tutoring", "icon_name": "book-open"},
            {"name": "Photography & Video", "slug": "photography-video", "icon_name": "camera"},
            {"name": "Lifestyle & Beauty", "slug": "lifestyle-beauty", "icon_name": "scissors"},
            {"name": "Writing & Translation", "slug": "writing-translation", "icon_name": "pen-tool"},
        ]

        cat_count = 0
        cat_map = {}
        for cat in categories:
            cat_obj, created = Category.objects.get_or_create(slug=cat['slug'], defaults=cat)
            cat_map[cat['slug']] = cat_obj
            if created:
                cat_count += 1
        self.stdout.write(self.style.SUCCESS(f"✓ Categories processed ({cat_count} new, {len(categories)} total)"))

        # -------------------------------------------------------------
        # 2. SEED TOP 100 NIGERIAN UNIVERSITIES
        # -------------------------------------------------------------
        universities = [
            # Top Federal Universities
            {"name": "University of Lagos", "short_code": "UNILAG", "state": "Lagos"},
            {"name": "University of Ibadan", "short_code": "UI", "state": "Oyo"},
            {"name": "Obafemi Awolowo University", "short_code": "OAU", "state": "Osun"},
            {"name": "University of Nigeria, Nsukka", "short_code": "UNN", "state": "Enugu"},
            {"name": "University of Benin", "short_code": "UNIBEN", "state": "Edo"},
            {"name": "University of Ilorin", "short_code": "UNILORIN", "state": "Kwara"},
            {"name": "Ahmadu Bello University", "short_code": "ABU", "state": "Kaduna"},
            {"name": "Federal University of Technology, Akure", "short_code": "FUTA", "state": "Ondo"},
            {"name": "Federal University of Technology, Minna", "short_code": "FUTMINNA", "state": "Niger"},
            {"name": "Federal University of Technology, Owerri", "short_code": "FUTO", "state": "Imo"},
            {"name": "University of Abuja", "short_code": "UNIABUJA", "state": "FCT"},
            {"name": "University of Jos", "short_code": "UNIJOS", "state": "Plateau"},
            {"name": "University of Calabar", "short_code": "UNICAL", "state": "Cross River"},
            {"name": "University of Port Harcourt", "short_code": "UNIPORT", "state": "Rivers"},
            {"name": "University of Uyo", "short_code": "UNIUYO", "state": "Akwa Ibom"},
            {"name": "Bayero University Kano", "short_code": "BUK", "state": "Kano"},
            {"name": "Federal University of Agriculture, Abeokuta", "short_code": "FUNAAB", "state": "Ogun"},
            {"name": "Abubakar Tafawa Balewa University", "short_code": "ATBU", "state": "Bauchi"},
            {"name": "Usmanu Danfodiyo University", "short_code": "UDUS", "state": "Sokoto"},
            {"name": "Modibbo Adama University", "short_code": "MAU", "state": "Adamawa"},
            {"name": "Federal University of Petroleum Resources", "short_code": "FUPRE", "state": "Delta"},
            {"name": "National Open University of Nigeria", "short_code": "NOUN", "state": "FCT"},
            {"name": "Nigerian Defence Academy", "short_code": "NDA", "state": "Kaduna"},
            {"name": "Air Force Institute of Technology", "short_code": "AFIT", "state": "Kaduna"},
            {"name": "Nigeria Maritime University", "short_code": "NMU", "state": "Delta"},
            {"name": "Nigerian Army University, Biu", "short_code": "NAUB", "state": "Borno"},
            {"name": "Nigerian Police Academy", "short_code": "POLAC", "state": "Kano"},
            {"name": "Federal University, Oye-Ekiti", "short_code": "FUOYE", "state": "Ekiti"},
            {"name": "Federal University, Lafia", "short_code": "FULAFIA", "state": "Nasarawa"},
            {"name": "Federal University, Lokoja", "short_code": "FULOKOJA", "state": "Kogi"},
            {"name": "Federal University, Dutse", "short_code": "FUD", "state": "Jigawa"},
            {"name": "Federal University, Dutsin-Ma", "short_code": "FUDMA", "state": "Katsina"},
            {"name": "Federal University, Kashere", "short_code": "FUKASHERE", "state": "Gombe"},
            {"name": "Federal University, Ndufu-Alike", "short_code": "AE-FUNAI", "state": "Ebonyi"},
            {"name": "Federal University, Otuoke", "short_code": "FUOTUOKE", "state": "Bayelsa"},
            {"name": "Federal University, Wukari", "short_code": "FUWUKARI", "state": "Taraba"},
            {"name": "Federal University, Birnin Kebbi", "short_code": "FUBK", "state": "Kebbi"},
            {"name": "Federal University, Gashua", "short_code": "FUGASHUA", "state": "Yobe"},
            {"name": "Federal University, Gusau", "short_code": "FUGUSAU", "state": "Zamfara"},
            {"name": "Federal University of Health Sciences, Otukpo", "short_code": "FUHSO", "state": "Benue"},
            {"name": "Federal University of Health Sciences, Ila-Orangun", "short_code": "FUHSI", "state": "Osun"},
            {"name": "Federal University of Agriculture, Zuru", "short_code": "FUAZ", "state": "Kebbi"},
            
            # Prominent State Universities
            {"name": "Lagos State University", "short_code": "LASU", "state": "Lagos"},
            {"name": "Lagos State University of Science and Technology", "short_code": "LASUSTECH", "state": "Lagos"},
            {"name": "Lagos State University of Education", "short_code": "LASUED", "state": "Lagos"},
            {"name": "Olabisi Onabanjo University", "short_code": "OOU", "state": "Ogun"},
            {"name": "Tai Solarin University of Education", "short_code": "TASUED", "state": "Ogun"},
            {"name": "Ekiti State University", "short_code": "EKSU", "state": "Ekiti"},
            {"name": "Adekunle Ajasin University", "short_code": "AAUA", "state": "Ondo"},
            {"name": "Olusegun Agagu University of Science and Technology", "short_code": "OAUSTECH", "state": "Ondo"},
            {"name": "Osun State University", "short_code": "UNIOSUN", "state": "Osun"},
            {"name": "Ladoke Akintola University of Technology", "short_code": "LAUTECH", "state": "Oyo"},
            {"name": "Kwara State University", "short_code": "KWASU", "state": "Kwara"},
            {"name": "Delta State University", "short_code": "DELSU", "state": "Delta"},
            {"name": "University of Delta, Agbor", "short_code": "UNIDEL", "state": "Delta"},
            {"name": "Dennis Osadebay University", "short_code": "DOU", "state": "Delta"},
            {"name": "Ambrose Alli University", "short_code": "AAU", "state": "Edo"},
            {"name": "Edo State University, Uzairue", "short_code": "EDSU", "state": "Edo"},
            {"name": "Rivers State University", "short_code": "RSU", "state": "Rivers"},
            {"name": "Ignatius Ajuru University of Education", "short_code": "IAUE", "state": "Rivers"},
            {"name": "Akwa Ibom State University", "short_code": "AKSU", "state": "Akwa Ibom"},
            {"name": "Cross River University of Technology", "short_code": "UNICROSS", "state": "Cross River"},
            {"name": "Abia State University", "short_code": "ABSU", "state": "Abia"},
            {"name": "Ebonyi State University", "short_code": "EBSU", "state": "Ebonyi"},
            {"name": "Enugu State University of Science and Technology", "short_code": "ESUT", "state": "Enugu"},
            {"name": "Imo State University", "short_code": "IMSU", "state": "Imo"},
            {"name": "Chukwuemeka Odumegwu Ojukwu University", "short_code": "COOU", "state": "Anambra"},
            {"name": "Benue State University", "short_code": "BSU", "state": "Benue"},
            {"name": "Prince Abubakar Audu University", "short_code": "PAAU", "state": "Kogi"},
            {"name": "Confluence University of Science and Technology", "short_code": "CUSTECH", "state": "Kogi"},
            {"name": "Nasarawa State University, Keffi", "short_code": "NSUK", "state": "Nasarawa"},
            {"name": "Plateau State University", "short_code": "PLASU", "state": "Plateau"},
            {"name": "Ibrahim Badamasi Babangida University", "short_code": "IBBU", "state": "Niger"},
            {"name": "Kaduna State University", "short_code": "KASU", "state": "Kaduna"},
            {"name": "Kano University of Science and Technology", "short_code": "KUST", "state": "Kano"},
            {"name": "Yusuf Maitama Sule University", "short_code": "YUMSUK", "state": "Kano"},
            {"name": "Umaru Musa Yar'adua University", "short_code": "UMYU", "state": "Katsina"},
            {"name": "Kebbi State University of Science and Technology", "short_code": "KSUSTA", "state": "Kebbi"},
            {"name": "Sokoto State University", "short_code": "SSU", "state": "Sokoto"},
            {"name": "Taraba State University", "short_code": "TSU", "state": "Taraba"},
            {"name": "Gombe State University", "short_code": "GSU", "state": "Gombe"},
            {"name": "Bauchi State University, Gadau", "short_code": "BASUG", "state": "Bauchi"},
            {"name": "Yobe State University", "short_code": "YSU", "state": "Yobe"},
            {"name": "Borno State University", "short_code": "BOSU", "state": "Borno"},

            # Top Private Universities
            {"name": "Covenant University", "short_code": "CU", "state": "Ogun"},
            {"name": "Babcock University", "short_code": "BU", "state": "Ogun"},
            {"name": "Afe Babalola University", "short_code": "ABUAD", "state": "Ekiti"},
            {"name": "Bowen University", "short_code": "BUI", "state": "Osun"},
            {"name": "Pan-Atlantic University", "short_code": "PAU", "state": "Lagos"},
            {"name": "Redeemer's University", "short_code": "RUN", "state": "Osun"},
            {"name": "Landmark University", "short_code": "LMU", "state": "Kwara"},
            {"name": "Baze University", "short_code": "BAZE", "state": "FCT"},
            {"name": "Nile University of Nigeria", "short_code": "NILE", "state": "FCT"},
            {"name": "American University of Nigeria", "short_code": "AUN", "state": "Adamawa"},
            {"name": "Lead City University", "short_code": "LCU", "state": "Oyo"},
            {"name": "Bells University of Technology", "short_code": "BELLS", "state": "Ogun"},
            {"name": "Elizade University", "short_code": "EU", "state": "Ondo"},
            {"name": "Igbinedion University, Okada", "short_code": "IUO", "state": "Edo"},
            {"name": "Caleb University", "short_code": "CALEB", "state": "Lagos"},
            {"name": "Wigwe University", "short_code": "WU", "state": "Rivers"},
        ]

        uni_count = 0
        for uni in universities:
            _, created = Institution.objects.get_or_create(
                name=uni['name'],
                defaults={'short_code': uni['short_code'], 'state': uni['state']}
            )
            if created:
                uni_count += 1
        self.stdout.write(self.style.SUCCESS(f"✓ Universities processed ({uni_count} new, {len(universities)} total)"))

        # -------------------------------------------------------------
        # 3. SEED 14 DEMO STUDENT PERSONAS (2 Original + 12 Additional)
        # -------------------------------------------------------------
        students_data = [
            # 1. Original Provider
            {
                "username": "david_tech",
                "email": "david.tech@campusskill.ng",
                "first_name": "David",
                "last_name": "Okafor",
                "institution_code": "UNILAG",
                "department": "Computer Science",
                "level": "300 Level",
                "bio": "Full-stack developer building robust mobile & web apps. Tech lead @ UNILAG Google Club.",
                "whatsapp_number": "+2348011223344",
                "whatsapp_visibility": "accepted_only",
                "skills": ["React", "TypeScript", "Django", "Python", "Tailwind CSS"],
            },
            # 2. Original Customer
            {
                "username": "sarah_arts",
                "email": "sarah.arts@campusskill.ng",
                "first_name": "Sarah",
                "last_name": "Adeyemi",
                "institution_code": "UNILAG",
                "department": "Creative Arts",
                "level": "200 Level",
                "bio": "UI/UX enthusiast and digital illustrator passionate about student startup brands.",
                "whatsapp_number": "+2348055667788",
                "whatsapp_visibility": "public",
                "skills": ["Figma", "Procreate", "Illustration"],
            },
            # 3. Emeka Eze - Photography & Video (UNILAG)
            {
                "username": "emeka_lens",
                "email": "emeka.lens@campusskill.ng",
                "first_name": "Emeka",
                "last_name": "Eze",
                "institution_code": "UNILAG",
                "department": "Mass Communication",
                "level": "400 Level",
                "bio": "Campus documentary & portrait photographer. Canon shooter with 3 years event experience.",
                "whatsapp_number": "+2348023456781",
                "whatsapp_visibility": "public",
                "skills": ["Portrait Photography", "Lightroom", "Event Coverage", "Videography"],
            },
            # 4. Omotola Adeleke - Lifestyle & Hair Braiding (LASU)
            {
                "username": "tola_braids",
                "email": "tola.braids@campusskill.ng",
                "first_name": "Omotola",
                "last_name": "Adeleke",
                "institution_code": "LASU",
                "department": "Economics",
                "level": "300 Level",
                "bio": "Professional hair stylist & braider on Ojo campus. Clean parts and painless braiding guaranteed.",
                "whatsapp_number": "+2348034567892",
                "whatsapp_visibility": "accepted_only",
                "skills": ["Knotless Braids", "Boho Curls", "Wig Revamp", "Locs"],
            },
            # 5. Zainab Mohammed - Academic Writing & SOPs (UI)
            {
                "username": "zainab_writes",
                "email": "zainab.writes@campusskill.ng",
                "first_name": "Zainab",
                "last_name": "Mohammed",
                "institution_code": "UI",
                "department": "English Literature",
                "level": "400 Level",
                "bio": "Dean's list writer specializing in scholarship SOPs, project proofreading, and APA/MLA formatting.",
                "whatsapp_number": "+2348045678903",
                "whatsapp_visibility": "public",
                "skills": ["Academic Proofreading", "SOP Review", "Copywriting", "Creative Writing"],
            },
            # 6. Kalu Anya - Flutter & Mobile Dev (FUTA)
            {
                "username": "kalu_codes",
                "email": "kalu.codes@campusskill.ng",
                "first_name": "Kalu",
                "last_name": "Anya",
                "institution_code": "FUTA",
                "department": "Computer Engineering",
                "level": "500 Level",
                "bio": "Cross-platform mobile developer & API specialist. Building high-performance Flutter apps.",
                "whatsapp_number": "+2348056789014",
                "whatsapp_visibility": "accepted_only",
                "skills": ["Flutter", "Dart", "Firebase", "PostgreSQL", "REST APIs"],
            },
            # 7. Grace Danjuma - Mathematics Tutoring (OAU)
            {
                "username": "grace_calc",
                "email": "grace.calc@campusskill.ng",
                "first_name": "Grace",
                "last_name": "Danjuma",
                "institution_code": "OAU",
                "department": "Mathematics",
                "level": "300 Level",
                "bio": "Passionate math tutor breaking down Calculus, Linear Algebra, and Statistics into simple steps.",
                "whatsapp_number": "+2348067890125",
                "whatsapp_visibility": "public",
                "skills": ["Calculus", "Linear Algebra", "MTH 101/201", "Statistics"],
            },
            # 8. Samuel Peters - Brand Identity & 3D (Covenant University)
            {
                "username": "samuel_graphics",
                "email": "samuel.graphics@campusskill.ng",
                "first_name": "Samuel",
                "last_name": "Peters",
                "institution_code": "CU",
                "department": "Architecture",
                "level": "400 Level",
                "bio": "Visual identity designer creating premium brand kits, minimalist logos, and 3D product mockups.",
                "whatsapp_number": "+2348078901236",
                "whatsapp_visibility": "accepted_only",
                "skills": ["Photoshop", "Illustrator", "Brand Identity", "3D Blender"],
            },
            # 9. Amaka Nwosu - Makeup & Gele (UNILAG)
            {
                "username": "amaka_glam",
                "email": "amaka.glam@campusskill.ng",
                "first_name": "Amaka",
                "last_name": "Nwosu",
                "institution_code": "UNILAG",
                "department": "Business Administration",
                "level": "200 Level",
                "bio": "Certified campus makeup artist. Soft glam, bridal party, and dinner looks that last all day.",
                "whatsapp_number": "+2348089012347",
                "whatsapp_visibility": "public",
                "skills": ["Bridal Makeup", "Soft Glam", "Gele Tying", "Skin Prep"],
            },
            # 10. Victor Balogun - Video Reels & Drone (LASU)
            {
                "username": "victor_shoots",
                "email": "victor.shoots@campusskill.ng",
                "first_name": "Victor",
                "last_name": "Balogun",
                "institution_code": "LASU",
                "department": "Theatre Arts",
                "level": "300 Level",
                "bio": "Video creator & drone pilot. Producing dynamic departmental hype reels and TikTok event recaps.",
                "whatsapp_number": "+2348090123458",
                "whatsapp_visibility": "accepted_only",
                "skills": ["Premiere Pro", "CapCut Pro", "Drone Flying", "Color Grading"],
            },
            # 11. Fatima Aliyu - Chemistry Lab & Tutorials (UI)
            {
                "username": "fatima_chem",
                "email": "fatima.chem@campusskill.ng",
                "first_name": "Fatima",
                "last_name": "Aliyu",
                "institution_code": "UI",
                "department": "Chemistry",
                "level": "400 Level",
                "bio": "Top-ranking tutor for Organic, Physical, and Analytical chemistry lab reports and tutorial sheets.",
                "whatsapp_number": "+2348012345679",
                "whatsapp_visibility": "public",
                "skills": ["Organic Chemistry", "Lab Reports", "CHE 157", "Biochemistry"],
            },
            # 12. Adebayo Shittu - Motion Graphics & Animation (OAU)
            {
                "username": "bayo_motion",
                "email": "bayo.motion@campusskill.ng",
                "first_name": "Adebayo",
                "last_name": "Shittu",
                "institution_code": "OAU",
                "department": "Fine & Applied Arts",
                "level": "300 Level",
                "bio": "Motion designer and 2D animator creating viral social media ads and kinetic typography videos.",
                "whatsapp_number": "+2348023456780",
                "whatsapp_visibility": "accepted_only",
                "skills": ["After Effects", "Motion Graphics", "Lottie Animations", "GIF Creation"],
            },
            # 13. Chinedu Okoli - CVs & Career Prep (UNIBEN)
            {
                "username": "chinedu_resume",
                "email": "chinedu.resume@campusskill.ng",
                "first_name": "Chinedu",
                "last_name": "Okoli",
                "institution_code": "UNIBEN",
                "department": "Faculty of Law",
                "level": "500 Level",
                "bio": "Career coach assisting students with winning CVs, cover letters, and internship applications.",
                "whatsapp_number": "+2348034567891",
                "whatsapp_visibility": "public",
                "skills": ["Resume Writing", "LinkedIn Optimization", "Cover Letters", "Interview Prep"],
            },
            # 14. Simi Ajayi - Hostel Barbering & Grooming (UNILAG)
            {
                "username": "simi_barber",
                "email": "simi.barber@campusskill.ng",
                "first_name": "Simi",
                "last_name": "Ajayi",
                "institution_code": "UNILAG",
                "department": "Marine Sciences",
                "level": "300 Level",
                "bio": "Premium hostel barber. Clean fades, beard sculpting, and convenient doorstep cuts on campus.",
                "whatsapp_number": "+2348045678902",
                "whatsapp_visibility": "accepted_only",
                "skills": ["Skin Fades", "Beard Grooming", "Hair Dye", "Hostel Delivery"],
            },
        ]

        user_map = {}
        for s_data in students_data:
            user_obj, u_created = User.objects.get_or_create(
                username=s_data['username'],
                defaults={
                    'email': s_data['email'],
                    'first_name': s_data['first_name'],
                    'last_name': s_data['last_name'],
                    'is_student': True,
                }
            )
            if u_created:
                user_obj.set_password('DemoPass123!')
                user_obj.save()

            inst = Institution.objects.filter(short_code=s_data['institution_code']).first()
            StudentProfile.objects.update_or_create(
                user=user_obj,
                defaults={
                    'institution': inst,
                    'department': s_data['department'],
                    'level': s_data['level'],
                    'bio': s_data['bio'],
                    'whatsapp_number': s_data['whatsapp_number'],
                    'whatsapp_visibility': s_data['whatsapp_visibility'],
                    'skills': s_data['skills'],
                }
            )
            user_map[s_data['username']] = user_obj

        self.stdout.write(self.style.SUCCESS(f"✓ Student personas processed ({len(students_data)} total profiles)"))

        # -------------------------------------------------------------
        # 4. SEED 17 DEMO SERVICES (2 Original + 15 Additional)
        # -------------------------------------------------------------
        services_data = [
            # Original David Services
            {
                "provider": "david_tech",
                "category_slug": "programming-tech",
                "title": "Full-Stack Web App Development (React & Django)",
                "skill_tag": "Web Development",
                "description": "Production-ready web applications, REST APIs, and database design for student startups and final-year projects.",
                "starting_price": Decimal("15000.00"),
                "turnaround_time": "3-5 days",
            },
            {
                "provider": "david_tech",
                "category_slug": "academics-tutoring",
                "title": "1-on-1 Python & Data Structures Tutoring",
                "skill_tag": "Python Tutoring",
                "description": "Comprehensive hands-on coding walkthroughs for CSC 201/301 past questions and practical lab exams.",
                "starting_price": Decimal("3500.00"),
                "turnaround_time": "Same day / Flexible",
            },
            # 1. Photography (Emeka)
            {
                "provider": "emeka_lens",
                "category_slug": "photography-video",
                "title": "Studio & Outdoor Campus Portrait Photography",
                "skill_tag": "Portrait Photography",
                "description": "Professional 1-hour photoshoot on campus (Amphitheatre, Senate building, Lagoon front). Includes 10 edited high-res digital copies.",
                "starting_price": Decimal("8000.00"),
                "turnaround_time": "2-3 days",
            },
            # 2. Video Editing (Emeka)
            {
                "provider": "emeka_lens",
                "category_slug": "photography-video",
                "title": "TikTok & Instagram Reels Video Editing",
                "skill_tag": "Video Editing",
                "description": "High-retention vertical reels editing with subtitles, trending sound design, dynamic transitions, and color correction.",
                "starting_price": Decimal("5000.00"),
                "turnaround_time": "24-48 hours",
            },
            # 3. Hair Braiding (Tola)
            {
                "provider": "tola_braids",
                "category_slug": "lifestyle-beauty",
                "title": "Knotless Braids & Passion Twists Styling",
                "skill_tag": "Hair Braiding",
                "description": "Neat, lightweight, pain-free knotless braids and passion twists. Hostel visits available around LASU Ojo campus.",
                "starting_price": Decimal("6500.00"),
                "turnaround_time": "Same day (3-5 hours)",
            },
            # 4. Wig Treatment (Tola)
            {
                "provider": "tola_braids",
                "category_slug": "lifestyle-beauty",
                "title": "Wig Washing, Deep Conditioning & Revamping",
                "skill_tag": "Wig Revamp",
                "description": "Revitalize tangled or dry bone-straight and curly wigs with deep steam conditioning, plucking, and hot-comb styling.",
                "starting_price": Decimal("3500.00"),
                "turnaround_time": "24-48 hours",
            },
            # 5. Proofreading (Zainab)
            {
                "provider": "zainab_writes",
                "category_slug": "writing-translation",
                "title": "Undergraduate Project Proofreading & APA Formatting",
                "skill_tag": "Project Editing",
                "description": "Detailed grammar, sentence flow, plagiarism reduction advice, and strict APA 7th edition referencing for final-year projects.",
                "starting_price": Decimal("4500.00"),
                "turnaround_time": "2-3 days",
            },
            # 6. SOP Review (Zainab)
            {
                "provider": "zainab_writes",
                "category_slug": "writing-translation",
                "title": "Statement of Purpose & Scholarship Essay Review",
                "skill_tag": "SOP Writing",
                "description": "Transform your personal statement for MasterCard, Chevening, or Erasmus Mundus scholarship applications into a compelling narrative.",
                "starting_price": Decimal("7500.00"),
                "turnaround_time": "2 days",
            },
            # 7. Mobile App Dev (Kalu)
            {
                "provider": "kalu_codes",
                "category_slug": "programming-tech",
                "title": "Cross-Platform Mobile App MVP (Flutter & Firebase)",
                "skill_tag": "Flutter Development",
                "description": "Complete Android & iOS mobile app MVP with clean UI, push notifications, and Firebase / REST backend integration.",
                "starting_price": Decimal("25000.00"),
                "turnaround_time": "5-7 days",
            },
            # 8. API Debugging (Kalu)
            {
                "provider": "kalu_codes",
                "category_slug": "programming-tech",
                "title": "Bug Fixing & Backend REST API Troubleshooting",
                "skill_tag": "Bug Fixing",
                "description": "Quick debugging and troubleshooting for Python Django, Node.js, and SQL database issues preventing project deployment.",
                "starting_price": Decimal("5000.00"),
                "turnaround_time": "Same day (12 hours)",
            },
            # 9. Math Tutoring (Grace)
            {
                "provider": "grace_calc",
                "category_slug": "academics-tutoring",
                "title": "Calculus 1 & 2 Crash Course (Past Question Drill)",
                "skill_tag": "Calculus Tutoring",
                "description": "Intensive tutorial on limits, differentiation, integration, and differential equations with proven tips for scoring an A.",
                "starting_price": Decimal("3000.00"),
                "turnaround_time": "Flexible 2-hr sessions",
            },
            # 10. Brand Kit Design (Samuel)
            {
                "provider": "samuel_graphics",
                "category_slug": "graphic-design",
                "title": "Minimalist Logo Design & Corporate Brand Kit",
                "skill_tag": "Logo Design",
                "description": "Clean, memorable vector logo with complete brand guidelines (color palette, typography) and 3D mockup presentations.",
                "starting_price": Decimal("10000.00"),
                "turnaround_time": "2-3 days",
            },
            # 11. Soft Glam Makeup (Amaka)
            {
                "provider": "amaka_glam",
                "category_slug": "lifestyle-beauty",
                "title": "Dinner & Convocation Soft Glam Makeup with Gele",
                "skill_tag": "Makeup Artistry",
                "description": "Flawless, camera-ready makeup for hall dinners, convocation ceremonies, and photo sessions with traditional gele styling.",
                "starting_price": Decimal("5000.00"),
                "turnaround_time": "Same day (90 mins)",
            },
            # 12. Event Drone Video (Victor)
            {
                "provider": "victor_shoots",
                "category_slug": "photography-video",
                "title": "Departmental Event Hype Video & Drone Coverage",
                "skill_tag": "Event Videography",
                "description": "High-energy event coverage for faculty dinners, sports weeks, and student union concerts. Includes aerial 4K drone b-roll.",
                "starting_price": Decimal("18000.00"),
                "turnaround_time": "3-4 days",
            },
            # 13. Chemistry Tutoring (Fatima)
            {
                "provider": "fatima_chem",
                "category_slug": "academics-tutoring",
                "title": "Organic Chemistry Reaction Mechanisms Coaching",
                "skill_tag": "Chemistry Tutoring",
                "description": "Demystifying SN1/SN2 reactions, electrophilic additions, and spectroscopic analysis for 100L/200L chemistry and pharmacy students.",
                "starting_price": Decimal("2500.00"),
                "turnaround_time": "Flexible 2-hr session",
            },
            # 14. Motion Graphics (Bayo)
            {
                "provider": "bayo_motion",
                "category_slug": "graphic-design",
                "title": "Animated Logo Intro & Kinetic Typography Promo",
                "skill_tag": "Motion Graphics",
                "description": "15-30 second high-impact animated intro or promotional ad video for campus startups, product launches, and student events.",
                "starting_price": Decimal("8500.00"),
                "turnaround_time": "2 days",
            },
            # 15. Resume Revamp (Chinedu)
            {
                "provider": "chinedu_resume",
                "category_slug": "writing-translation",
                "title": "ATS-Compliant Resume Revamp & LinkedIn Optimization",
                "skill_tag": "Resume Writing",
                "description": "Stand out to FMCG, tech, and banking recruiters with an ATS-friendly CV formatted with high-impact action verbs and achievements.",
                "starting_price": Decimal("4000.00"),
                "turnaround_time": "24 hours",
            },
            # 16. Hostel Haircut (Simi)
            {
                "provider": "simi_barber",
                "category_slug": "lifestyle-beauty",
                "title": "Doorstep Hostel Haircut & Beard Grooming",
                "skill_tag": "Barbing & Grooming",
                "description": "Crisp low cuts, skin fades, taper fades, and hot-towel beard styling delivered right to your hostel room. Clean sterilized equipment.",
                "starting_price": Decimal("2000.00"),
                "turnaround_time": "Within 1-2 hours",
            },
            # 17. UI/UX Prototype (Sarah)
            {
                "provider": "sarah_arts",
                "category_slug": "graphic-design",
                "title": "Figma Mobile App UI/UX Wireframing & Interactive Prototype",
                "skill_tag": "UI/UX Design",
                "description": "Intuitive, modern 5-10 screen mobile application design ready for developer handoff, complete with clickable user flows.",
                "starting_price": Decimal("12000.00"),
                "turnaround_time": "3-4 days",
            },
        ]

        svc_count = 0
        for s_info in services_data:
            prov = user_map.get(s_info['provider'])
            cat = cat_map.get(s_info['category_slug'])
            if prov and cat:
                _, created = ServiceListing.objects.get_or_create(
                    provider=prov,
                    title=s_info['title'],
                    defaults={
                        'category': cat,
                        'skill_tag': s_info['skill_tag'],
                        'description': s_info['description'],
                        'starting_price': s_info['starting_price'],
                        'turnaround_time': s_info['turnaround_time'],
                        'is_active': True,
                    }
                )
                if created:
                    svc_count += 1

        self.stdout.write(self.style.SUCCESS(f"✓ Marketplace service listings processed ({svc_count} new, {len(services_data)} total)"))
        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete! Database is fully populated with rich campus data."))