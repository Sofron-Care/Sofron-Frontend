import Nav from "../home/components/Nav";
import Footer from "../home/components/Footer";

export default function Privacy() {
  return (
    <>
      <Nav />

      <div className="section">
        <div className="container legal-page">
          <h1>Privacy Policy</h1>

          <p>
            Sofron respects your privacy. This demo does not collect or store
            any real personal data.
          </p>

          <h3>Demo Environment</h3>
          <p>
            All information displayed in this demo is generated sample data and
            is not tied to real individuals.
          </p>

          <h3>Data Collection</h3>
          <p>
            During this demo, no personal information is permanently stored or
            used outside of the demonstration session.
          </p>

          <h3>Future Policy</h3>
          <p>
            A full privacy policy will be implemented before the official launch
            of Sofron.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
