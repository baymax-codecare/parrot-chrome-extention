const storagePrefix = "parrot_chrome_extension";

const storage = {
  clearAllMetaData: () => {
    window.localStorage.clear();
  },
  setCollectionMeta: (tokenMint: string, data: any) => {
    window.localStorage.setItem(
      `collection-meta-${storagePrefix}-${tokenMint}`,
      JSON.stringify(data)
    );
  },
  getCollectionMeta: (tokenMint: string) => {
    const data = window.localStorage.getItem(
      `collection-meta-${storagePrefix}-${tokenMint}`
    );

    if (data) return JSON.parse(data);

    return null;
  },
};

export default storage;
