export default function Place({ name, id }: { name: string; id: string }) {
  const form_name = `placename_${id}`;

  return (
    <fieldset class="place">
      <legend>{name}</legend>
      <label class="positive">
        Positive
        <input type="radio" name={form_name} value="positive" />
      </label>
      <label class="neutral">
        Neutral
        <input type="radio" name={form_name} value="neutral" checked />
      </label>
      <label class="negative">
        Negative
        <input type="radio" name={form_name} value="negative" />
      </label>
    </fieldset>
  );
}
