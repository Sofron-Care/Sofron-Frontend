import Nav from "../home/components/Nav";
import Footer from "../home/components/Footer";

export default function Terms() {
  return (
    <>
      <Nav />

      <div className="section">
        <div className="container legal-page">
          <h1>Terms of Service</h1>

          <p>
            These Terms of Service are provided for demonstration purposes only.
            Sofron is currently in a pre-release stage and not yet available for
            public use.
          </p>

          <h3>Use of the Platform</h3>
          <p>
            This demo environment is intended to showcase functionality and does
            not represent a production system.
          </p>

          <h3>No Guarantees</h3>
          <p>
            All data in this demo is simulated. No real patient or business data
            is stored or processed.
          </p>

          <h3>Future Updates</h3>
          <p>Full legal terms will be published prior to official launch.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
