import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [folderSizes, setFolderSizes] = useState({});
  const [images, setImages] = useState([]);

  const [folderName, setFolderName] = useState("");

  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    fetchFolders();
    fetchImages();

    // eslint-disable-next-line
  }, []);

  // FETCH FOLDERS
  const fetchFolders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/folders"
      );

      setFolders(res.data);

      res.data.forEach((folder) => {
        fetchFolderSize(folder._id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH IMAGES
  const fetchImages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/images"
      );

setImages(res.data);

alert(JSON.stringify(res.data[0]));




    } catch (error) {
      console.log(error);
    }
  };

  // FETCH FOLDER SIZE
  const fetchFolderSize = async (folderId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/folders/size/${folderId}`
      );

      setFolderSizes((prev) => ({
        ...prev,
        [folderId]: res.data.folderSize,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE FOLDER
  const createFolder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/folders/create",
        {
          name: folderName,
        }
      );

      setFolderName("");

      fetchFolders();

      alert("Folder Created Successfully 🚀");
    } catch (error) {
      console.log(error);
      alert("Failed to create folder");
    }
  };

  // UPLOAD IMAGE
// UPLOAD IMAGE
const uploadImage = async () => {
  try {
    if (!selectedFolder) {
      alert("Please select a folder first");
      return;
    }

    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("name", imageName);
    formData.append("folderId", selectedFolder);
    formData.append("image", selectedFile);

    await axios.post(
      "http://localhost:5000/api/images/upload",
      formData
    );

    alert("Image Uploaded Successfully 🚀");

    await fetchImages();
    await fetchFolders();

    setImageName("");
    setSelectedFile(null);
    setSelectedFolder("");
  } catch (error) {
    console.log(error);
    alert("Image Upload Failed");
  }
};



  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  // GET IMAGES FOR FOLDER
// GET IMAGES FOR FOLDER
const getFolderImages = (folderId) => {
  return images.filter((image) => {
    if (!image.folderId) return false;

    // HANDLE OBJECT OR STRING ID
    const currentFolderId =
      typeof image.folderId === "object"
        ? image.folderId._id
        : image.folderId;

    return String(currentFolderId) === String(folderId);
  });
};



  return (
    <div className="dashboard">
      <div className="navbar">
        <h1>Dobby Drive</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CREATE FOLDER */}

      <div className="section-card">
        <h2>Create New Folder</h2>

        <input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <button
          onClick={createFolder}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Create Folder
        </button>
      </div>

      {/* UPLOAD IMAGE */}

      <div className="section-card">
        <h2>Upload Image</h2>

        <input
          type="text"
          placeholder="Enter image name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />

        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="">Select Folder</option>

          {folders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button
          onClick={uploadImage}
          style={{
            background:
              "linear-gradient(to right, #22c55e, #16a34a)",
          }}
        >
          Upload Image
        </button>
      </div>

      {/* WORKSPACE */}

      <div style={{ marginTop: "40px" }}>
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          Your Workspace
        </h2>

        <div className="folder-grid">
          {folders.map((folder) => (
            <div key={folder._id} className="folder-card">
              <h3>📁 {folder.name}</h3>

              <p>
                Storage Used:{" "}
                <strong>
                 

{folderSizes[folder._id] || 0} bytes




                </strong>
              </p>

              {/* IMAGES */}

              <div style={{ marginTop: "15px" }}>
                {getFolderImages(folder._id).map((image) => (
                  <div
                    key={image._id}
                    style={{ marginTop: "15px" }}
                  >
                    <img
  src={`http://localhost:5000${image.imageUrl}`}
  alt={image.name}
  style={{
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "12px",
  }}
/>

                    <p
                      style={{
                        marginTop: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      🖼️ {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

