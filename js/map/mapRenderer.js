export function createMapRenderer({ canvas, context, camera, tileRenderer }) {
    return {
        render() {
            tileRenderer.render();
        },
    };
}
