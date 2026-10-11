async function selectTexforeverFolder() {

    try {

        const isCapacitor =
            !!(
                window.Capacitor &&
                typeof window.Capacitor.isNativePlatform === "function" &&
                window.Capacitor.isNativePlatform()
            );

        if (isCapacitor) {

            const plugin =
                window.Capacitor?.Plugins?.TexforeverStorage ||
                window.Capacitor?.registerPlugin?.("TexforeverStorage");

            if (!plugin || typeof plugin.selectFolder !== "function") {
                throw new Error("Android folder picker is not available.");
            }

            const result = await plugin.selectFolder();

            if (!result || !result.uri) {
                throw new Error("No folder was selected.");
            }

            localStorage.setItem(
                "texforever_selected_folder",
                result.name || "Selected Folder"
            );

            localStorage.setItem(
                "texforever_selected_folder_uri",
                result.uri
            );

            localStorage.setItem(
                "texforever_save_mode",
                "android_folder"
            );

            alert(
                "📁 Folder Selected Successfully!\n\n" +
                "Folder: " +
                (result.name || "Selected Folder") +
                "\n\nBackup files will be saved in this folder."
            );

            return result;
        }
// Electron Desktop
if (
    window.texforeverStorage &&
    typeof window.texforeverStorage.selectFolder === "function"
) {
    const result = await window.texforeverStorage.selectFolder();

    if (!result || !result.success) {
        throw new Error(
            result?.message || "Electron folder selection failed."
        );
    }

    localStorage.setItem(
        "texforever_selected_folder",
        result.folder
    );

    localStorage.setItem(
        "texforever_save_mode",
        "electron_folder"
    );

    alert(
        "📁 Folder Selected Successfully!\n\n" +
        "Folder: " +
        result.folder +
        "\n\nERP data will be saved in this folder."
    );

    return result;
}
        if (typeof window.showDirectoryPicker !== "function") {

            alert(
                "📁 Folder selection is not supported on this browser/device."
            );

            return null;
        }

        const handle = await window.showDirectoryPicker();

        localStorage.setItem(
            "texforever_selected_folder",
            handle.name
        );

        localStorage.setItem(
            "texforever_save_mode",
            "desktop_folder"
        );

        if (typeof syncToCloudStorage === "function") {
            await syncToCloudStorage(handle);
        }

        alert(
            "📁 Folder successfully selected:\n" +
            handle.name
        );

        return handle;

    } catch (err) {

        if (err && err.name === "AbortError") {
            return null;
        }

        console.error(
            "Folder selection failed:",
            err
        );

        alert(
            "❌ Folder selection failed.\n\n" +
            (err?.message || "Please try again.")
        );

        return null;
    }
}
