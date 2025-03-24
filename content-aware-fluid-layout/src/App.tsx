import './App.scss';

function App() {
  return (
    <>
      <h1>Content aware fluid layout</h1>
      <section>
        <h2>Featured Articles</h2>
        <div className="grid">
          <article className="card">
            <img src="src/assets/nebula.webp" alt="glowing clouds of gas and dust" />
            <h3>The Cosmic Art of Nebulas</h3>
            <p>
              Nebulas are the masterpieces of the universe, painting space with vivid colors. But
              these glowing clouds of gas and dust are more than just beautiful—they’re the
              birthplaces of stars.
            </p>

            <p>
              <a href="#">Read more about cosmic art of nebulas</a>
            </p>
          </article>

          <article className="card">
            <h3>The Secret Heartbeat of the Universe: Pulsars</h3>
            <p>
              Spinning at mind-bending speeds, pulsars are cosmic lighthouses flashing across space.
              Discover how these dense, collapsed stars help us measure time and even hunt for
              gravitational waves.
            </p>
            <p>
              <a href="#">Read more pulsars</a>
            </p>
          </article>

          <article className="card">
            <h3>Metallic Rain and Diamond Cores: Strange Star Worlds</h3>
            <p>
              Not all stars are made equal. Some have atmospheres of pure iron rain, while others
              could host diamond cores bigger than Earth. Step into the weird world of stellar
              oddities.
            </p>
            <p>
              <a href="#">Read more about strange star worlds</a>
            </p>
          </article>

          <article className="card">
            <h3>Red Giants and the Future of Our Sun</h3>
            <p>
              One day, our Sun will swell into a red giant, swallowing Mercury and Venus. But what
              happens next? Will Earth survive, or will it be consumed in the fiery farewell?
            </p>
            <p>
              <a href="#">Read more about red giants</a>
            </p>
          </article>

          <article className="card">
            <h3>What Lies Beyond the Event Horizon?</h3>
            <p>
              A black hole’s event horizon is a one-way door to the unknown. But what really happens
              if you cross it? Science and theory collide in this mind-bending journey.
            </p>
            <p>
              <a href="#">Read more about event horizon</a>
            </p>
          </article>

          <article className="card">
            <h3>Supermassive Black Holes: The Giants That Shape Galaxies</h3>
            <p>
              Lurking at the heart of most galaxies, supermassive black holes influence everything
              around them. But how did they form, and what role do they play in the cosmic dance?
            </p>
            <p>
              <a href="#">Read more about using black holes</a>
            </p>
          </article>

          <article className="card">
            <h3>Time Travel and Spaghettification: The Physics of Falling In</h3>
            <p>
              Approaching a black hole is a trip like no other—where time slows, space bends, and
              reality itself starts to break. Could black holes be the key to time travel?
            </p>
            <p>
              <a href="#">Read more about Spaghettification</a>
            </p>
          </article>

          <article className="card">
            <h3>The Black Hole That Shouldn’t Exist</h3>
            <img src="src/assets/pulsars.webp" alt="glowing clouds of gas and dust" />
            <p>
              Some black holes defy expectations, growing faster than they should or existing where
              theory says they can’t. Scientists are on a quest to solve the mystery of these cosmic
              rebels.
            </p>
            <p>
              <a href="#">Read more about black holes</a>
            </p>
          </article>

          <article className="card">
            <h3>The Life and Death of a Star</h3>
            <p>
              From fiery birth in a stellar nursery to a dramatic supernova, stars live incredible
              lives. But what determines whether they become a white dwarf, neutron star, or
              something even more extreme?
            </p>

            <p>
              <a href="#">Read more about the life and death of a star</a>
            </p>
          </article>

          <article className="card">
            <h3>The Pillars of Creation: A Star-Forming Factory</h3>
            <p>
              One of the most famous nebulae in the universe, the Pillars of Creation is a place
              where stars are born. But new evidence suggests it might have been destroyed thousands
              of years ago.
            </p>
            <p>
              <a href="#">Read more about the pillars of creation</a>
            </p>
          </article>

          <article className="card">
            <h3>Ghostly Remnants: When Stars Leave Their Mark</h3>
            <p>
              Not all nebulas are nurseries—some are tombstones. The glowing remnants of exploded
              stars light up the cosmos, revealing secrets about the violent deaths of celestial
              giants.
            </p>
            <p>
              <a href="#">Read more about ghostly remnants</a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default App;
