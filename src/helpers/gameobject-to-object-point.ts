type ObjectPoint = {
    height: number;
    id: number;
    name: string;
    point: boolean;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
};

export const gameObjectsToObjectPoints = (gameObjects: unknown[]): ObjectPoint[] => {
    return gameObjects.map(gameObject => gameObject as ObjectPoint);
};