from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Institution, StudentProfile
from services.models import Category, ServiceListing

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds initial categories, top 100 Nigerian universities, and demo student marketplace data."

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
        for cat in categories:
            _, created = Category.objects.get_or_create(slug=cat['slug'], defaults=cat)
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
        # 3. SEED DEMO STUDENT PERSONAS & LISTINGS
        # -------------------------------------------------------------
        unilag = Institution.objects.filter(short_code='UNILAG').first()
        tech_cat = Category.objects.filter(slug='programming-tech').first()
        tutoring_cat = Category.objects.filter(slug='academics-tutoring').first()

        # Demo Provider: david_tech
        demo_provider, p_created = User.objects.get_or_create(
            username='david_tech',
            defaults={
                'email': 'david.tech@campusskill.ng',
                'first_name': 'David',
                'last_name': 'Okafor',
                'is_student': True,
            }
        )
        if p_created:
            demo_provider.set_password('DemoPass123!')
            demo_provider.save()

        # Provider Profile
        StudentProfile.objects.update_or_create(
            user=demo_provider,
            defaults={
                'institution': unilag,
                'department': 'Computer Science',
                'level': '300 Level',
                'bio': 'Full-stack developer building robust mobile & web apps. Tech lead @ UNILAG Google Club.',
                'whatsapp_number': '+2348011223344',
                'whatsapp_visibility': 'accepted_only',
                'skills': ['React', 'TypeScript', 'Django', 'Python', 'Tailwind CSS'],
            }
        )

        # Demo Customer: sarah_arts
        demo_customer, c_created = User.objects.get_or_create(
            username='sarah_arts',
            defaults={
                'email': 'sarah.arts@campusskill.ng',
                'first_name': 'Sarah',
                'last_name': 'Adeyemi',
                'is_student': True,
            }
        )
        if c_created:
            demo_customer.set_password('DemoPass123!')
            demo_customer.save()

        StudentProfile.objects.update_or_create(
            user=demo_customer,
            defaults={
                'institution': unilag,
                'department': 'Creative Arts',
                'level': '200 Level',
                'bio': 'UI/UX enthusiast and digital illustrator.',
                'whatsapp_number': '+2348055667788',
                'whatsapp_visibility': 'public',
                'skills': ['Figma', 'Procreate', 'Illustration'],
            }
        )

        # Demo Listings for David
        if tech_cat:
            ServiceListing.objects.get_or_create(
                provider=demo_provider,
                title="Full-Stack Web App Development (React & Django)",
                defaults={
                    'category': tech_cat,
                    'skill_tag': 'Web Development',
                    'description': 'Production-ready web applications, REST APIs, and database design for student startups and final-year projects.',
                    'starting_price': Decimal('15000.00'),
                    'turnaround_time': '3-5 days',
                    'is_active': True,
                }
            )

        if tutoring_cat:
            ServiceListing.objects.get_or_create(
                provider=demo_provider,
                title="1-on-1 Python & Data Structures Tutoring",
                defaults={
                    'category': tutoring_cat,
                    'skill_tag': 'Python Tutoring',
                    'description': 'Comprehensive hands-on coding walkthroughs for CSC 201/301 past questions and practical lab exams.',
                    'starting_price': Decimal('3500.00'),
                    'turnaround_time': 'Same day / Flexible',
                    'is_active': True,
                }
            )

        self.stdout.write(self.style.SUCCESS("✓ Demo student personas & service listings created!"))
        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete! Database is fully initialized for development."))