declare module "gaze" {
    
    function gaze(file: string, cb: (err: Error, watcher: gaze.Gaze) => void)
    function gaze(files: string[], cb: (err: Error, watcher: gaze.Gaze) => void)

    module gaze {
        class Gaze {
            /**
             * Get all watched files
             */
            watched()
            /**
             * on event trigger
             */
            on(e: string, cb: (e: string, filepath: string) => void)
            /**
             * on event trigger
             */
            on(e: string, cb: (filepath: string) => void)
            /**
             * Adds file(s) patterns to be watched.
             */
            add(files: string | string[])
            /**
             * removes a file or directory from being watched.
             */
            remove(filename: string)
        }
    }

    export = gaze;
}
