          <motion.h1 initial={{ x:-60, opacity:0 }} animate={{ x:0, opacity:1 }} className="text-4xl md:text-6xl font-bold">
            Gifts she'll adore — curated with love
          </motion.h1>
          <motion.p initial={{ x:-60, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.15 }} className="mt-6 text-lg text-gray-700">
            Premium curated gifts, bundles and experiences for her. Timely delivery and beautiful packaging.
          </motion.p>
          <div className="mt-8 flex gap-4">
            <Link to="/products" className="px-6 py-3 rounded-full bg-brandPink text-white shadow-md">Shop Gifts</Link>
            <Link to="/bundles" className="px-6 py-3 rounded-full border border-brandPink">Buy Bundles</Link>
          </div>
        </div >

  <div className="relative">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="floating bg-white p-6 rounded-3xl shadow-premium">
      <img src="/src/assets/placeholder.jpg" alt="gifts" className="w-full rounded-2xl img-zoom" />
      <div className="mt-4">
        <div className="font-semibold">Luxury Rose Package</div>
        <div className="text-sm text-gray-600">Top seller • From ₹1,499</div>
      </div>
    </motion.div>
  </div>
      </div >
    </section >
  )
}
