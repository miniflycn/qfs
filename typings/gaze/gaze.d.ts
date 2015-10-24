declare module "gaze" {
    interface Gaze {
        watched()
        on(e: string, cb)
        add(files: string | string[])
        remove(filename: string)
    }

    function gaze(file: string, cb: (err: Error, watcher: Gaze) => void)
    function gaze(files: string[], cb: (err: Error, watcher: Gaze) => void)

    export = gaze;
}
