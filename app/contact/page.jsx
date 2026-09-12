import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact | Exabyte Academy",
  description:
    "Get in touch with Exabyte Academy — send a course enquiry or find our phone, email, and address.",
};

export default function ContactPage() {
  return (
    <main>
      <Section
        background="none"
        className="bg-gradient-to-br from-primary to-accent text-white"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-xl text-white/90">
          Have a question about our courses? Send us an enquiry and
          we&apos;ll get back to you.
        </p>
      </Section>

      <Section background="white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1 flex flex-col gap-4">
            <Card className="flex items-start gap-3">
              <FaPhone size={18} className="text-primary mt-1" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-navy/60">Phone</p>
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="text-sm text-ink hover:text-primary"
                >
                  {site.phone}
                </a>
              </div>
            </Card>

            <Card className="flex items-start gap-3">
              <FaWhatsapp size={18} className="text-primary mt-1" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-navy/60">Message</p>
                <a
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink hover:text-primary"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </Card>

            <Card className="flex items-start gap-3">
              <FaEnvelope size={18} className="text-primary mt-1" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-navy/60">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-ink hover:text-primary"
                >
                  {site.email}
                </a>
              </div>
            </Card>

            <Card className="flex items-start gap-3">
              <FaMapMarkerAlt
                size={18}
                className="text-primary mt-1"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-medium text-navy/60">Address</p>
                <p className="text-sm text-ink">{site.address}</p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <h2 className="font-heading text-xl font-semibold text-ink">
                Send an enquiry
              </h2>
              <p className="mt-1 text-sm text-navy/80">
                Tell us a bit about what you&apos;re looking for and we&apos;ll
                follow up.
              </p>
              <div className="mt-6">
                <EnquiryForm />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
