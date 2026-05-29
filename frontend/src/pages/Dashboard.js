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
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/folders",
        {
          headers: {
            Authorization: token,
          },
        }
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
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/images",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setImages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH FOLDER SIZE
  const fetchFolderSize = async (folderId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/folders/size/${folderId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setFolderSizes((prev) => ({
        ...prev,
        [folderId]: res.data.folderSize,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE FOLDER / SUBFOLDER
  const createFolder = async (parentFolder = null) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/folders/create",
        {
          name: folderName,
          parentFolder,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setFolderName("");

      fetchFolders();
    } catch (error) {
      console.log(error);
    }
  };

  // UPLOAD IMAGE
  const uploadImage = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("name", imageName);
      formData.append("folderId", selectedFolder);
      formData.append("image", selectedFile);

      await axios.post(
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Image Uploaded Successfully 🚀");

      fetchFolders();
      fetchImages();

      setImageName("");
      setSelectedFile(null);
      setSelectedFolder("");
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  // GET CHILD FOLDERS
  const getChildFolders = (parentId) => {
    return folders.filter(
      (folder) => folder.parentFolder === parentId
    );
  };

  // GET IMAGES FOR FOLDER
  const getFolderImages = (folderId) => {
    return images.filter(
      (image) => image.folderId === folderId
    );
  };

  return (
    <div className="dashboard">
      {/* NAVBAR */}

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
          onClick={() => createFolder()}
          style={{
            background:
              "linear-gradient(to right, #3b82f6, #6366f1)",
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

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "20px",
          }}
        >
          Organize folders, manage images, and monitor
          storage beautifully.
        </p>

        <div className="folder-grid">
          {folders
            .filter((folder) => !folder.parentFolder)
            .map((folder) => (
              <div key={folder._id} className="folder-card">
                <h3>📁 {folder.name}</h3>

                <p>
                  Storage Used:{" "}
                  <strong>
                    {folderSizes[folder._id] || 0} bytes
                  </strong>
                </p>

                <button
                  onClick={() => createFolder(folder._id)}
                  style={{
                    marginTop: "10px",
                    background:
                      "linear-gradient(to right, #6366f1, #8b5cf6)",
                  }}
                >
                  + Add Subfolder
                </button>

                {/* IMAGES */}

                <div style={{ marginTop: "15px" }}>
                  {getFolderImages(folder._id).map((image) => (
                    <div key={image._id} style={{ marginTop: "15px" }}>
                      <img
                        src={`http://localhost:5000/${image.imageUrl}`}
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

                {/* CHILD FOLDERS */}

                <div style={{ marginTop: "20px" }}>
                  {getChildFolders(folder._id).map((child) => (
                    <div
                      key={child._id}
                      className="subfolder"
                    >
                      <p>
                        📁 <strong>{child.name}</strong>
                      </p>

                      <p>
                        Size:{" "}
                        {folderSizes[child._id] || 0} bytes
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