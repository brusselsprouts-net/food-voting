export default function Place({ name, id }: { name: string; id: string }) {
  return (
    <fieldset class="place">
      <legend>{name}</legend>
      <label class="positive">
        Positive
        <input type="radio" name={id} value="positive" />
      </label>
      <label class="neutral">
        Neutral
        <input type="radio" name={id} value="neutral" checked />
      </label>
      <label class="negative">
        Negative
        <input type="radio" name={id} value="negative" />
      </label>
    </fieldset>
  );
}
